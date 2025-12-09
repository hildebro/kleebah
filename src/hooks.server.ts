import { sequence } from '@sveltejs/kit/hooks'
import * as auth from '$lib/server/auth'
import { type Handle, redirect } from '@sveltejs/kit'
import { paraglideMiddleware } from '$lib/paraglide/server'
import { findAdmins, findUserByRssToken } from '$lib/server/db'
import * as appPath from '$app/paths'
import { building } from '$app/environment'
import { seed } from '$lib/server/db/seed.ts'

async function startup() {
  // 1. Don't run this during the build process (adapter generation)
  if (building) return;

  try {
    // 2. Run the seed function
    await seed();
  } catch (e) {
    console.error('Database seed failed:', e);
  }
}

await startup();

const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) => {
    event.request = request

    return resolve(event, {
      transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
    })
  })

const handleAuth: Handle = async ({ event, resolve }) => {
  const admins = await findAdmins()
  if (admins.length === 0 && event.route.id !== '/setup') {
    redirect(302, appPath.resolve('/setup'))
  }

  const rssToken = event.url.searchParams.get('rss_token')
  const rssTokenUser = rssToken ? await findUserByRssToken(rssToken) : null
  if (rssTokenUser) {
    event.locals.user = rssTokenUser

    return resolve(event)
  }

  const sessionToken = event.cookies.get(auth.sessionCookieName)
  if (!sessionToken) {
    event.locals.user = null
    event.locals.session = null

    return resolve(event)
  }

  const { session, user } = await auth.validateSessionToken(sessionToken)
  if (session) {
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt)
  } else {
    auth.deleteSessionTokenCookie(event)
  }

  event.locals.user = user
  event.locals.session = session

  if (
    !event.locals.session?.twoFactorVerified &&
    event.locals.user?.twoFactorSecret &&
    event.route.id !== '/login/2fa'
  ) {
    redirect(302, appPath.resolve('/login/2fa'))
  }

  return resolve(event)
}

export const handle: Handle = sequence(handleParaglide, handleAuth)
