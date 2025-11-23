import type { Actions, PageServerLoad } from './$types'
import { createAdmin, findAdmins } from '$lib/server/db'
import { error, fail, redirect } from '@sveltejs/kit'
import * as auth from '$lib/server/auth.ts'
import { hashPassword } from '$lib/server/password.ts'
import { resolve } from '$app/paths'
import { z } from 'zod'

export const load: PageServerLoad = async () => {
  const admins = await findAdmins()
  if (admins.length > 0) {
    error(409, 'Setup already complete')
  }

  return {}
}

const adminSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/),
  password: z.string().min(8).max(100)
})

export const actions: Actions = {
  default: async (event) => {
    // Assertion before adding the new admin
    const admins = await findAdmins()
    if (admins.length > 0) {
      error(409, 'Setup already complete')
    }

    const formData = Object.fromEntries(await event.request.formData())
    const result = adminSchema.safeParse(formData)
    if (!result.success) {
      error(400, result.error)
    }

    const passwordHash = await hashPassword(result.data.password)
    const adminId = await createAdmin(result.data.username, passwordHash)

    const sessionToken = auth.generateSessionToken()
    const session = await auth.createSession(sessionToken, adminId)
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt)

    return redirect(302, resolve('/'))
  }
}
