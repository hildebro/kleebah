import type { PageServerLoad } from './$types'
import { encodeHexLowerCase, decodeHex } from '@oslojs/encoding'
import { createTOTPKeyURI, verifyTOTP } from '@oslojs/otp'
import QRCode from 'qrcode'
import type { Actions } from '../../../.svelte-kit/types/src/routes/setup/$types'
import { error } from '@sveltejs/kit'
import { z } from 'zod'
import { saveTwoFactorSecret } from '$lib/server/db'

export const load: PageServerLoad = async (event) => {
  const twoFactorSecret = crypto.getRandomValues(new Uint8Array(20))
  const hexSecret = encodeHexLowerCase(twoFactorSecret)

  // maybe use generateTOTP instead?
  const uri = createTOTPKeyURI('Kleebah', event.locals.user?.id as string, twoFactorSecret, 30, 6)

  const qrImage = await QRCode.toDataURL(uri)

  return { qrImage, hexSecret }
}

const twoFactorSchema = z.object({
  hexSecret: z.string().nonempty(),
  totp: z.string().nonoptional()
})

export const actions: Actions = {
  default: async (event) => {
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
  }
}
