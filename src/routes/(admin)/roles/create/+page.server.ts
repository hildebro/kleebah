import type { Actions, PageServerLoad } from './$types'
import { createRole } from '$lib/server/db'
import { error, redirect } from '@sveltejs/kit'
import { resolve } from '$app/paths'
import { z } from 'zod'

export const load: PageServerLoad = async () => {
  return {}
}

const roleSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/),
  parentId: z.string().nonoptional()
})

export const actions: Actions = {
  create: async (event) => {
    const formData = Object.fromEntries(await event.request.formData())
    const result = roleSchema.safeParse(formData)
    if (!result.success) {
      throw error(400, result.error)
    }

    const parentId = result.data.parentId === 'none' ? null : result.data.parentId;

    await createRole(result.data.name, parentId)

    return redirect(302, resolve('/roles'))
  }
}
