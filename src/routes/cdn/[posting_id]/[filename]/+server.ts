// src/routes/data/[...path]/+server.js
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { error } from '@sveltejs/kit'

// Helper to get the directory name in a module context
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Calculate the absolute path to your top-level 'data' directory
// Go up from +server.js -> [...path] -> data -> routes -> src -> project root
const DATA_ROOT = path.resolve(__dirname, '../../../../../data')

// Simple function to guess the MIME type based on file extension
const getMimeType = (filePath: string) => {
  const ext = path.extname(filePath).toLowerCase()

  // image/apng: Animated Portable Network Graphics (APNG)
  // image/avif : AV1 Image File Format (AVIF)
  // image/svg+xml: Scalable Vector Graphics (SVG)
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.gif':
      return 'image/gif'
    case '.webp':
      return 'image/webp'
    case '.apng':
      return 'image/apng'
    case '.svg':
      return 'image/svg+xml'
    default:
      throw error(422, 'unsupported type')
  }
}

/** @type {import('../../../../../.svelte-kit/types/src/routes').RequestHandler} */
export async function GET({ url }) {
  // Remove /cdn from the start of the pathname
  const filePathSegment = url.pathname.substring(4)

  // Resolve the full, absolute path to the requested file
  const absolutePath = path.join(DATA_ROOT, filePathSegment)
  console.log(absolutePath)

  // Basic security check to prevent directory traversal
  if (!absolutePath.startsWith(DATA_ROOT)) {
    throw error(403, 'Forbidden')
  }

  try {
    // Read the file content
    const fileContent = await fs.readFile(absolutePath)

    // Determine the MIME type
    const contentType = getMimeType(absolutePath)

    // Return a Response with the file content and correct headers
    return new Response(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000' // CDN-like caching
      }
    })
  } catch (e) {
    // If the file doesn't exist, throw a 404 error
    if (e.code === 'ENOENT') {
      throw error(404, 'File Not Found')
    }
    // Throw a 500 error for any other file reading issue
    console.error('Error serving file:', e)
    throw error(500, 'Internal Server Error')
  }
}
