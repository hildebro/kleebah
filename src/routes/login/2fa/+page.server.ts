import { error, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { resolve } from '$app/paths'
import * as auth from '$lib/server/auth.ts'
import { z } from 'zod'
import { verifyTOTP } from '@oslojs/otp'
import { decodeHex } from '@oslojs/encoding'

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.session?.twoFactorVerified || !locals.user?.twoFactorSecret) {
    redirect(302, resolve('/'))
  }
}

const twoFactorSchema = z.object({
  totp: z.string().nonoptional()
})

export const actions: Actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData())
    const result = twoFactorSchema.safeParse(formData)
    if (!result.success) {
      throw error(400, result.error)
    }

    const user = event.locals.user
    if (!user) {
      throw error(401, 'User not logged in')
    }

    if (!user.twoFactorSecret) {
      throw error(401, 'User has no 2fa secret')
    }

    const isValid = verifyTOTP(decodeHex(user.twoFactorSecret), 30, 6, result.data.totp)
    if (!isValid) {
      throw error(400, 'Invalid TOTP')
    }

    await auth.setTwoFactorVerified(event.locals.session?.id as string)

    return redirect(302, resolve('/'))
  }
}
