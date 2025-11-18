import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';
import { fail, redirect } from '@sveltejs/kit';
import { createPosting } from '$lib/server/db';

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    const content = formData?.content;
    if (!content) {
      return fail(422)
    }

    await createPosting(
      formData?.title as string,
      formData?.description as string,
      content as string
    )

    return redirect(302, resolve('/'))
  },
};