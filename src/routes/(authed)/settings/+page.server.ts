import { decodeHex, encodeHexLowerCase } from '@oslojs/encoding'
import { createTOTPKeyURI, verifyTOTP } from '@oslojs/otp'
import QRCode from 'qrcode'
import { error, redirect } from '@sveltejs/kit'
import { z } from 'zod'
import { removeTwoFactorSecret, saveTwoFactorSecret } from '$lib/server/db'
import { removeTwoFactorVerified, setTwoFactorVerified } from '$lib/server/auth.ts'
import type { Actions, PageServerLoad } from './$types'
import { resolve } from '$app/paths'

export const load: PageServerLoad = async ({ locals }) => {
  // No need to load any 2FA related data, if it's already set up
  if (locals.user?.twoFactorSecret) {
    return {}
  }

  const twoFactorSecret = crypto.getRandomValues(new Uint8Array(20))
  const hexSecret = encodeHexLowerCase(twoFactorSecret)

  // maybe use generateTOTP instead?
  const uri = createTOTPKeyURI('Kleebah', locals.user?.id as string, twoFactorSecret, 30, 6)

  const qrImage = await QRCode.toDataURL(uri)

  return { qrImage, hexSecret }
}

const twoFactorSchema = z.object({
  hexSecret: z.string().nonempty(),
  totp: z.string().nonoptional()
})

export const actions: Actions = {
  enable_2fa: async (event) => {
    const formData = Object.fromEntries(await event.request.formData())
    const result = twoFactorSchema.safeParse(formData)
    if (!result.success) {
      throw error(400, result.error)
    }

    const isValid = verifyTOTP(decodeHex(result.data.hexSecret), 30, 6, result.data.totp)
    if (!isValid) {
      throw error(400, 'Invalid TOTP')
    }

    await saveTwoFactorSecret(event.locals.user?.id as string, result.data.hexSecret)
    await setTwoFactorVerified(event.locals.session?.id as string)
  },
  disable_2fa: async ({ locals }) => {
    await removeTwoFactorSecret(locals.user?.id as string)
    await removeTwoFactorVerified(locals.session?.id as string)
  }
}
