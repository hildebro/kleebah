import type { LayoutServerLoad } from './$types'
import { findRoles } from '$lib/server/db'

export const load: LayoutServerLoad = async () => {
  return { roles: await findRoles() }
}
