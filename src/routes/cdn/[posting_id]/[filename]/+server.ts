import { fetchImage } from '$lib/server/filesystem.ts'
import { fileTypeFromBuffer } from 'file-type'
import { findPosting } from '$lib/server/db'
import { Visibility } from '$lib/server/db/schema.ts'
import { error } from '@sveltejs/kit'

export async function GET({ params, locals }) {
  const posting = await findPosting(params.posting_id)
  if (!posting) {
    return error(404, 'No posting posting found.')
  }

  if (posting.visibility !== Visibility.Public && !locals.user) {
    // Technically a 403, but we pretend it's a 404 instead to not leak information.
    return error(404, 'Post not found')
  }

  const fileContent = await fetchImage(params.posting_id, params.filename)

  const contentType = await fileTypeFromBuffer(fileContent)
  if (!contentType?.mime) {
    throw new Error(`File has no mime type: ${params}`)
  }

  return new Response(fileContent, {
    headers: {
      'Content-Type': contentType.mime,
      'Cache-Control': 'public, max-age=31536000'
    }
  })
}
