import type { LayoutServerLoad } from './$types'
import { error, redirect } from '@sveltejs/kit'
import { resolve } from '$app/paths'
import { findAdmin } from '$lib/server/db'

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return redirect(302, resolve('/login'))
  }

  const admin = await findAdmin(locals.user.id)
  if (!admin) {
    return error(403)
  }

  return {}
}
