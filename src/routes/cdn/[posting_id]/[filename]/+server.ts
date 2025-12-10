import { fetchImage } from '$lib/server/filesystem.ts'
import { fileTypeFromBuffer } from 'file-type'
import { findAdmin, findPosting } from '$lib/server/db'
import { Visibility } from '$lib/server/db/schema.ts'
import { error } from '@sveltejs/kit'

export async function GET({ params, locals }) {
  if (params.posting_id === 'new') {
    if (!locals.user || !await findAdmin(locals.user.id)) {
      throw error(404, 'Only admins can access the "new" folder.')
    }
  } else {
    const posting = await findPosting(params.posting_id)
    if (!posting) {
      throw error(404, 'No posting found.')
    }

    if (posting.visibility !== Visibility.Public && !locals.user) {
      // Technically a 403, but we pretend it's a 404 instead to not leak information.
      throw error(404, 'Post not found')
    }
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
