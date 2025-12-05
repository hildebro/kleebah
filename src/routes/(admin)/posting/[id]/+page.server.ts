import { resolve } from '$app/paths'
import { error, redirect } from '@sveltejs/kit'
import { deletePosting, findPosting, updatePosting } from '$lib/server/db'
import { deleteFiles, fetchFilenames } from '$lib/server/filesystem.ts'
import { z } from 'zod'
import type {
  Actions,
  PageServerLoad
} from './$types'
import { Visibility } from '$lib/server/db/schema.ts'

export const load: PageServerLoad = async ({ params }) => {
  const posting = await findPosting(params.id)
  if (!posting) {
    return error(404, 'Posting not found')
  }

  return {
    posting: posting,
    filenames: fetchFilenames(params.id)
  }
}

const postSchema = z.object({
  id: z.string().nonempty(),
  title: z.string().nonempty(),
  description: z.string(),
  content: z.string().nonempty(),
  visibility: z.enum(Visibility).nonoptional()
})

const deletePostingSchema = z.object({
  id: z.string().nonempty()
})

export const actions: Actions = {
  update: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData())
    const result = postSchema.safeParse(formData)
    if (!result.success) {
      return error(422, result.error)
    }

    const post = result.data

    await updatePosting(post.id, post.title, post.description, post.content, post.visibility)

    return redirect(302, resolve('/posting'))
  },
  delete: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData())
    const result = deletePostingSchema.safeParse(formData)
    if (!result.success) {
      return error(422, result.error)
    }

    await deletePosting(result.data.id)
    deleteFiles(result.data.id)

    return redirect(302, resolve('/posting'))
  }
}
