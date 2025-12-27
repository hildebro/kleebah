import { json } from '@sveltejs/kit'
import { z } from 'zod'
import { deleteImage, IMAGE_MIME_TYPES, saveImage } from '$lib/server/filesystem.ts'

const imageUploadSchema = z.object({
  file: z.file().mime(IMAGE_MIME_TYPES),
  postingId: z.union([z.string().nonempty(), z.undefined()])
})

export async function POST({ request }) {
  const formData = Object.fromEntries(await request.formData())
  const result = imageUploadSchema.safeParse(formData)
  if (!result.success) {
    return json({ error: result.error }, { status: 422 })
  }

  try {
    const file = result.data.file
    await saveImage(file, result.data.postingId)

    return json({ success: true })
  } catch (err) {
    console.error(err)
    return json({ error: 'Upload failed' }, { status: 500 })
  }
}

const imageDeleteSchema = z.object({
  filename: z.string().nonempty(),
  postingId: z.union([z.string().nonempty(), z.undefined()])
})

export async function DELETE({ request }) {
  const formData = Object.fromEntries(await request.formData())
  const result = imageDeleteSchema.safeParse(formData)
  if (!result.success) {
    return json({ error: result.error }, { status: 422 })
  }

  try {
    deleteImage(result.data.postingId ?? 'new', result.data.filename)

    return json({ success: true })
  } catch (err) {
    console.error(err)
    return json({ error: 'Deletion failed' }, { status: 500 })
  }
}