import { fetchImage } from '$lib/server/cdn.ts'
import { fileTypeFromBuffer } from 'file-type'

export async function GET({ params }) {
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
