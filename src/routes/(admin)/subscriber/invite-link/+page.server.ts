import type { Actions, PageServerLoad } from './$types'
import { createInviteLink, findRoles } from '$lib/server/db'
import { error, redirect } from '@sveltejs/kit'
import { resolve } from '$app/paths'
import { z } from 'zod'
import { buildRoleTree } from '$lib/roles.ts'

export const load: PageServerLoad = async () => {
  const flatRoles = await findRoles()
  const roleTree = buildRoleTree(flatRoles)

  return { roleTree }
}

const inviteLinkSchema = z.object({
  expiry: z.enum(['short', 'medium', 'long', 'none']),
  roles: z.transform(value => {
    if (!value) return []
    if (!Array.isArray(value)) return [value]
    return value
  }).pipe(z.array(z.string()).nonoptional())
})

export const actions: Actions = {
  default: async (event) => {
    const rawFormData = await event.request.formData()
    const formData = {
      ...Object.fromEntries(rawFormData),
      roles: rawFormData.getAll('roles')
    }
    const result = inviteLinkSchema.safeParse(formData)
    if (!result.success) {
      throw error(400, result.error)
    }

    let expiresAt: Date | null = new Date()
    switch (result.data.expiry) {
      case 'short':
        expiresAt.setHours(expiresAt.getHours() + 1)
        break
      case 'medium':
        expiresAt.setDate(expiresAt.getDate() + 3)
        break
      case 'long':
        expiresAt.setDate(expiresAt.getDate() + 30)
        break
      case 'none':
        expiresAt = null
        break
      default:
        throw error(422, `unrecognized expiry: ${result.data.expiry}`)
    }

    await createInviteLink(result.data.roles, expiresAt)

    return redirect(302, resolve('/subscriber'))
  }
}
