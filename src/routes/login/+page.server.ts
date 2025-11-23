import { error, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { resolve } from '$app/paths'
import { verifyPasswordHash } from '$lib/server/password.ts'
import { findUser } from '$lib/server/db'
import * as auth from '$lib/server/auth.ts'
import { z } from 'zod'

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    redirect(302, resolve('/'))
  }
}

const loginSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty()
})

export const actions: Actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData())
    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      throw error(400, result.error)
    }

    const user = await findUser(result.data.username)
    if (!user) {
      throw error(401, 'Invalid credentials')
    }

    const validPassword = await verifyPasswordHash(user.passwordHash, result.data.password)
    if (!validPassword) {
      throw error(401, 'Invalid credentials')
    }

    const sessionToken = auth.generateSessionToken()
    const session = await auth.createSession(sessionToken, user.id)
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt)

    return redirect(302, resolve('/'))
  }
}
