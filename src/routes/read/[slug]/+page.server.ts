import type { PageServerLoad } from './$types';
import { findPosting } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const blog = await findPosting(params.slug);
  if (!blog) {
    return fail(404);
  }

  return { blog };
};
