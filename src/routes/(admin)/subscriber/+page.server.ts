import type { PageServerLoad } from './$types'
import { deleteInviteLink, findInviteLinks, findSubscribers } from '$lib/server/db'
import { type Actions, error, redirect } from '@sveltejs/kit'
import { resolve } from '$app/paths'
import { z } from 'zod'

export const load: PageServerLoad = async () => {
  return { subscribers: await findSubscribers(), inviteLinks: await findInviteLinks() }
}

const inviteLinkDeleteSchema = z.object({
  id: z.string().nonoptional()
})

export const actions: Actions = {
  deleteInviteLink: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData())
    const result = inviteLinkDeleteSchema.safeParse(formData)
    if (!result.success) {
      throw error(400, result.error)
    }

    await deleteInviteLink(result.data.id)

    return redirect(302, resolve('/subscriber'))
  }
}
