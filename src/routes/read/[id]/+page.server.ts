import type { PageServerLoad } from './$types'
import { findPosting } from '$lib/server/db'
import { error } from '@sveltejs/kit'
import { Visibility } from '$lib/server/db/schema.ts'

export const load: PageServerLoad = async ({ params, locals }) => {
  const blog = await findPosting(params.id)
  if (!blog) {
    throw error(404, 'Blog post not found')
  }

  if (blog.visibility !== Visibility.Public && !locals.user) {
    // Technically a 403, but we pretend it's a 404 instead to not leak information.
    throw error(404, 'Blog post not found')
  }

  return { blog }
}
