import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'
import { env } from '$env/dynamic/private'
import { posting } from './schema'
import { encodeBase32LowerCase } from '@oslojs/encoding'
import { eq } from 'drizzle-orm'
import { replaceImageRefs } from '$lib/server/filesystem.ts'

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set')

const client = createClient({ url: env.DATABASE_URL })

export const db = drizzle(client, { schema })

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
