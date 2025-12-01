import { resolve } from '$app/paths'
import { error, redirect } from '@sveltejs/kit'
import { findPosting, updatePosting } from '$lib/server/db'
import { fetchFilenames } from '$lib/server/filesystem.ts'
import { z } from 'zod'
import type {
  Actions,
  PageServerLoad
} from '../../../../.svelte-kit/types/src/routes/posting/[id]/$types'

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
  content: z.string().nonempty()
})

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData())
    const result = postSchema.safeParse(formData)
    if (!result.success) {
      error(422, result.error)
    }

    const post = result.data

    await updatePosting(post.id, post.title, post.description, post.content)

    return redirect(302, resolve('/posting'))
  }
}
