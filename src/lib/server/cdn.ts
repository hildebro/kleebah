import fs from 'node:fs'
import path from 'path'

const DATA_DIRECTORY = path.join(process.cwd(), 'data')

export const moveNewImages = (id: string) => {
  const newDataDirectory = path.join(DATA_DIRECTORY, 'new')
  const idDataDirectory = path.join(DATA_DIRECTORY, id)

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
