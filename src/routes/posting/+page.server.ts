import type { PageServerLoad } from './$types'
import { findPostingsForUser } from '$lib/server/db'

export const load: PageServerLoad = async ({ locals }) => {
  return { blogs: await findPostingsForUser(locals.user?.id) }
}
