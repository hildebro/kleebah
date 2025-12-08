import type { Actions, PageServerLoad } from './$types'
import { deleteRole, findRole, updateRole } from '$lib/server/db'
import { error, redirect } from '@sveltejs/kit'
import { resolve } from '$app/paths'
import { z } from 'zod'

export const load: PageServerLoad = async ({ params }) => {
  const role = await findRole(params.id)
  if (!role) {
    return error(404, 'Role not found')
  }

  return { role }
}

const roleSchema = z.object({
  id: z.string().nonoptional(),
  name: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/),
  parentId: z.string().nonoptional()
})

const roleDeleteSchema = z.object({
  id: z.string().nonoptional()
})

export const actions: Actions = {
  update: async (event) => {
    const formData = Object.fromEntries(await event.request.formData())
    const result = roleSchema.safeParse(formData)
    if (!result.success) {
      throw error(400, result.error)
    }

    const parentId = result.data.parentId === 'none' ? null : result.data.parentId

    await updateRole(result.data.id, result.data.name, parentId)

    return redirect(302, resolve('/roles'))
  },
  delete: async (event) => {
    const formData = Object.fromEntries(await event.request.formData())
    const result = roleDeleteSchema.safeParse(formData)
    if (!result.success) {
      throw error(400, result.error)
    }

    await deleteRole(result.data.id)

    return redirect(302, resolve('/roles'))
  }
}
