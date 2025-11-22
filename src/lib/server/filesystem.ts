import fs from 'node:fs'
import path from 'path'
import { error } from '@sveltejs/kit'

export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/apng',
  'image/svg+xml'
]

const DATA_DIRECTORY = path.join(process.cwd(), 'data')

export const fetchFilenames = () => {
  const newDataDirectory = path.join(DATA_DIRECTORY, 'new')
  if (!fs.existsSync(newDataDirectory)) {
    return []
  }

  return fs.readdirSync(newDataDirectory)
}

export const fetchImage = async (postingId: string, filename: string) => {
  const pathToFile = path.join(DATA_DIRECTORY, postingId, filename)

  try {
    return fs.readFileSync(pathToFile)
  } catch (e) {
    const fileError = e as { code: string }
    // If the file doesn't exist, throw a 404 error.
    if (fileError.code === 'ENOENT') {
      error(404, 'File not found')
    }

    throw new Error(`Error serving file: ${e}`)
  }
}

export const saveImage = async (file: File) => {
  const uploadDir = path.join(DATA_DIRECTORY, 'new')

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const filePath = path.join(uploadDir, sanitizeFilename(file.name))
  fs.writeFileSync(filePath, buffer)
}

export const moveNewImages = (id: string) => {
  const newDataDirectory = path.join(DATA_DIRECTORY, 'new')
  const idDataDirectory = path.join(DATA_DIRECTORY, id)

  // Nothing to do, if no new images are present
  if (!fs.existsSync(newDataDirectory) || fs.readdirSync(newDataDirectory).length === 0) {
    return
  }

  fs.mkdirSync(idDataDirectory)

  const filenames = fs.readdirSync(newDataDirectory)
  for (const filename of filenames) {
    fs.renameSync(path.join(newDataDirectory, filename), path.join(idDataDirectory, filename))
  }
}

/**
 * When writing blogs, new images are saved in `data/new/$filename` and referenced via
 * `cdn/new/$filename` in the content block. When the posting is saved and receives an ID, we
 * replace the `new` part of the reference with the ID.
 */
export const replaceImageRefs = (id: string, content: string): string => {
  const pattern: RegExp = /(\[.*]\(\/cdn\/)(new)(\/.*?\))/g

  return content.replace(pattern, `$1${id}$3`)
}

/**
 * Sanitizes a filename string to make it safe for storage on a server.
 */
const sanitizeFilename = (filename: string): string => {
  let safeName = filename.trim()
  // Decompose characters (e.g., accents)
  safeName = safeName.normalize('NFD')

  // Separate name and extension
  let baseName = safeName
  let extension = ''
  const lastDot = safeName.lastIndexOf('.')

  if (lastDot !== -1 && lastDot !== 0) {
    extension = safeName.substring(lastDot)
    baseName = safeName.substring(0, lastDot)
  }

  // Strip Illegal/Unsafe Characters from base name
  // Matches reserved characters, path separators, control characters, and symbols
  // eslint-disable-next-line no-control-regex
  const unsafeCharsRegex = /[\\/:*?"<>|~!@#$%^&()+=`';,{}[\]\u0000-\u001F]/g
  baseName = baseName.replace(unsafeCharsRegex, '-')

  // Handle Path Traversal and Redundancy
  baseName = baseName.replace(/\.\.+/g, '') // Remove '..' sequences
  baseName = baseName.replace(/\./g, '-') // Replace remaining single dots with hyphens (prevents ambiguity)
  baseName = baseName.replace(/\s+/g, '-') // Replace spaces with hyphens
  baseName = baseName.replace(/-{2,}/g, '-') // Collapse multiple hyphens
  baseName = baseName.replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens

  // Re-compose and Final Check
  baseName = baseName.normalize('NFC')

  // Fallback if the base name became empty
  if (baseName.length === 0) {
    baseName = `file-${Date.now()}`
  }

  // Limit total length
  const MAX_LENGTH = 200
  const totalLength = baseName.length + extension.length
  if (totalLength > MAX_LENGTH) {
    baseName = baseName.substring(0, MAX_LENGTH - extension.length)
  }

  return baseName + extension
}
