import { resolve } from '$app/paths'
import { error, redirect } from '@sveltejs/kit'
import { createPosting } from '$lib/server/db'
import { fetchFilenames, moveNewImages } from '$lib/server/filesystem.ts'
import { z } from 'zod'
import type { Actions, PageServerLoad } from './$types'
import { Visibility } from '$lib/server/db/schema.ts'

export const load: PageServerLoad = async () => {
  return { filenames: fetchFilenames() }
}

const postSchema = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  content: z.string().nonempty(),
  visibility: z.enum(Visibility).nonoptional()
})

export const actions: Actions = {
  create: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData())
    const result = postSchema.safeParse(formData)
    if (!result.success) {
      return error(422, result.error)
    }

    const post = result.data

    const id = await createPosting(post.title, post.description, post.content, post.visibility)
    moveNewImages(id)

    return redirect(302, resolve('/posting'))
  }
}
