import type { PageServerLoad } from './$types'
import { findPosting } from '$lib/server/db'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
  const blog = await findPosting(params.slug)
  if (!blog) {
    throw error(404, 'Blog post not found')
  }

  return { blog }
}
