import type { Actions, PageServerLoad } from './$types'
import { createSubscriber } from '$lib/server/db'
import { error, redirect } from '@sveltejs/kit'
import { hashPassword } from '$lib/server/password.ts'
import { resolve } from '$app/paths'
import { z } from 'zod'

export const load: PageServerLoad = async () => {
  return {}
}

const subscriberSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/),
  password: z.string().min(8).max(100)
})

export const actions: Actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData())
    const result = subscriberSchema.safeParse(formData)
    if (!result.success) {
      error(400, result.error)
    }

    const passwordHash = await hashPassword(result.data.password)
    await createSubscriber(result.data.username, passwordHash)

    return redirect(302, resolve('/subscriber'))
  }
}
