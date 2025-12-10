import type { Actions, PageServerLoad } from './$types'
import { deleteSubscriber, findRoles, findSubscriber, updateSubscriber } from '$lib/server/db'
import { error, redirect } from '@sveltejs/kit'
import { hashPassword } from '$lib/server/password.ts'
import { resolve } from '$app/paths'
import { z } from 'zod'
import { buildRoleTree } from '$lib/roles.ts'

export const load: PageServerLoad = async ({ params }) => {
  const subscriber = await findSubscriber(params.id)
  if (!subscriber) {
    return error(404, 'Subscriber not found')
  }

  const flatRoles = await findRoles()
  const roleTree = buildRoleTree(flatRoles)

  return { subscriber, roleTree }
}

const subscriberSchema = z.object({
  id: z.string().nonoptional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/),
  password: z
    .union([
      z.string().length(0), // Optional, forms return empty string instead of undefined
      z.string().min(8).max(100)
    ])
    .optional(),
  roles: z.transform(value => {
    if (!value) return []
    if (!Array.isArray(value)) return [value]
    return value
  }).pipe(z.array(z.string()).nonoptional())
})

const subscriberDeleteSchema = z.object({
  id: z.string().nonoptional()
})

export const actions: Actions = {
  update: async (event) => {
    const rawFormData = await event.request.formData()
    const formData = {
      ...Object.fromEntries(rawFormData),
      roles: rawFormData.getAll('roles')
    }
    const result = subscriberSchema.safeParse(formData)
    if (!result.success) {
      return error(400, result.error)
    }

    const passwordHash = result.data.password ? await hashPassword(result.data.password) : undefined
    await updateSubscriber(result.data.id, result.data.username, passwordHash, result.data.roles)

    return redirect(302, resolve('/subscriber'))
  },
  delete: async (event) => {
    const formData = Object.fromEntries(await event.request.formData())
    const result = subscriberDeleteSchema.safeParse(formData)
    if (!result.success) {
      return error(400, result.error)
    }

    await deleteSubscriber(result.data.id)

    return redirect(302, resolve('/subscriber'))
  }
}
