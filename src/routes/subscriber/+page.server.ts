import type { PageServerLoad } from './$types'
import { findSubscribers } from '$lib/server/db'

export const load: PageServerLoad = async () => {
  return { subscribers: await findSubscribers() }
}
