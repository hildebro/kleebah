import type { Actions, PageServerLoad } from './$types'
import { createSubscriber, findInviteLink, findRolesByInviteLink, findUser } from '$lib/server/db'
import { error, redirect } from '@sveltejs/kit'
import { hashPassword } from '$lib/server/password.ts'
import * as auth from '$lib/server/auth.ts'
import { resolve } from '$app/paths'
import { z } from 'zod'

export const load: PageServerLoad = async ({ params, locals }) => {
  if (locals.user) {
    throw error(403, 'Already logged in')
  }

  const inviteLink = await findInviteLink(params.id)
  if (!inviteLink) {
    throw error(404, 'Invite link not found')
  }

  if (inviteLink.expiresAt && inviteLink.expiresAt < new Date()) {
    throw error(400, 'Invite link expired')
  }

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
      throw error(400, result.error)
    }

    if (await findUser(result.data.username)) {
      throw error(400, 'Username already taken')
    }

    const inviteLink = await findInviteLink(event.params.id)
    if (!inviteLink) {
      throw error(400, 'Invite link does not exist')
    }

    if (inviteLink.expiresAt && inviteLink.expiresAt < new Date()) {
      throw error(400, 'Invite link expired')
    }

    const roles = (await findRolesByInviteLink(inviteLink.id))
      .map(role => role.id)

    const passwordHash = await hashPassword(result.data.password)
    const subscriberId = await createSubscriber(result.data.username, passwordHash, roles)

    const sessionToken = auth.generateSessionToken()
    const session = await auth.createSession(sessionToken, subscriberId)
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt)

    return redirect(302, resolve('/'))
  }
}
