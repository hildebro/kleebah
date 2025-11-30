import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'
import { admin, posting, subscriber, user } from './schema'
import { env } from '$env/dynamic/private'
import { encodeBase32LowerCase } from '@oslojs/encoding'
import { eq } from 'drizzle-orm'
import { replaceImageRefs } from '$lib/server/filesystem.ts'

const client = createClient({ url: env.DATABASE_URL ?? 'file:local.db' })

export const db = drizzle(client, { schema })

export const findUser = async (username: string) => {
  return db.query.user
    .findFirst({
      where: eq(user.username, username)
    })
    .execute()
}

export const findAdmins = async () => {
  return db.query.admin.findMany().execute()
}

export const createAdmin = async (username: string, passwordHash: string) => {
  const id = generateUUID()
  await db.insert(user).values({ id, username, passwordHash }).execute()
  await db.insert(admin).values({ id }).execute()

  return id
}

export const findSubscribers = async () => {
  return db.query.subscriber
    .findMany({
      with: {
        user: true
      }
    })
    .execute()
}

export const createSubscriber = async (username: string, passwordHash: string) => {
  const id = generateUUID()
  await db.insert(user).values({ id, username, passwordHash }).execute()
  await db.insert(subscriber).values({ id }).execute()
}

export const saveTwoFactorSecret = async (userId: string, hexSecret: string) => {
  await db.update(user).set({ twoFactorSecret: hexSecret }).where(eq(user.id, userId)).execute()
}

export const createPosting = async (title: string, description: string, content: string) => {
  const id = generateUUID()

  const fixedRefContent = replaceImageRefs(id, content)

  await db.insert(posting).values({ id, title, description, content: fixedRefContent }).execute()

  return id
}

export const findAllPostings = async () => {
  return db.query.posting.findMany().execute()
}

export const findPosting = async (id: string) => {
  return db.query.posting
    .findFirst({
      where: eq(posting.id, id)
    })
    .execute()
}

function generateUUID() {
  // ID with 120 bits of entropy, or about the same as UUID v4.
  const bytes = crypto.getRandomValues(new Uint8Array(15))
  return encodeBase32LowerCase(bytes)
}
