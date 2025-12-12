import type { PageServerLoad } from './$types'
import { findPosting } from '$lib/server/db'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params, locals }) => {
  const blog = await findPosting(params.id, locals.user?.id)
  if (!blog) {
    throw error(404, 'Blog post not found')
  }

  return { blog }
}
