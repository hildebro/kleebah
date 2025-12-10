import type { Actions, PageServerLoad } from './$types'
import { createSubscriber, findRoles } from '$lib/server/db'
import { error, redirect } from '@sveltejs/kit'
import { hashPassword } from '$lib/server/password.ts'
import { resolve } from '$app/paths'
import { z } from 'zod'
import { buildRoleTree } from '$lib/roles.ts'

export const load: PageServerLoad = async () => {
  const flatRoles = await findRoles()
  const roleTree = buildRoleTree(flatRoles)

  return { roleTree }
}

const subscriberSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/),
  password: z.string().min(8).max(100),
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
    const result = subscriberSchema.safeParse(formData)
    if (!result.success) {
      throw error(400, result.error)
    }

    const passwordHash = await hashPassword(result.data.password)
    await createSubscriber(result.data.username, passwordHash, result.data.roles)

    return redirect(302, resolve('/subscriber'))
  }
}
