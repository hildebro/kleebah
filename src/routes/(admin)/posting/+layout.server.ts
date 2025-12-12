import type { LayoutServerLoad } from './$types'
import { findRoles } from '$lib/server/db'
import { buildRoleTree } from '$lib/roles.ts'

export const load: LayoutServerLoad = async () => {
  const flatRoles = await findRoles()
  const roleTree = buildRoleTree(flatRoles)

  return { roleTree }
}
