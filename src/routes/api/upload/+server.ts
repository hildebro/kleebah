import { json } from '@sveltejs/kit'
import { z } from 'zod'
import { IMAGE_MIME_TYPES, saveImage } from '$lib/server/cdn.ts'

const fileSchema = z.object({
  file: z.file().mime(IMAGE_MIME_TYPES)
})

export async function POST({ request }) {
  const formData = Object.fromEntries(await request.formData());
  const result = fileSchema.safeParse(formData)
  if (!result.success) {
    return json({ error: result.error }, { status: 422 })
  }

  try {
    const file = result.data.file
    await saveImage(file)

    return json({ success: true })
  } catch (err) {
    console.error(err)
    return json({ error: 'Upload failed' }, { status: 500 })
  }
}
