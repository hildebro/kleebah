import type { PageServerLoad } from './$types'
import { findAllPostings } from '$lib/server/db'

export const load: PageServerLoad = async () => {
  return { blogs: findAllPostings() }
}
