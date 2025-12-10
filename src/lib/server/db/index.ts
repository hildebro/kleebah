import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'
import { admin, posting, role, subscriber, subscriberToRole, user, Visibility } from './schema'
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

export const findAdmin = async (id: string) => {
  return db.query.admin
    .findFirst({
      with: {
        user: true
      },
      where: eq(admin.id, id)
    })
    .execute()
}

export const findUserByRssToken = async (token: string) => {
  return db.query.user
    .findFirst({
      where: eq(user.rssToken, token)
    })
    .execute()
}

export const createAdmin = async (username: string, passwordHash: string) => {
  const id = generateUUID()
  await db.insert(user).values({ id, username, passwordHash }).execute()
  await db.insert(admin).values({ id }).execute()

  return id
}

export const findSubscriber = async (id: string) => {
  return db.query.subscriber
    .findFirst({
      with: {
        user: true,
        subscribersToRoles: true
      },
      where: eq(subscriber.id, id)
    })
    .execute()
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

export const createSubscriber = async (username: string, passwordHash: string, roles: string[]) => {
  const id = generateUUID()
  await db.insert(user).values({ id, username, passwordHash }).execute()
  await db.insert(subscriber).values({ id }).execute()

  if (roles.length === 0) {
    return
  }

  const inserts = roles.map(roleId => {
    return {
      roleId,
      subscriberId: id
    }
  })
  await db.insert(subscriberToRole).values(inserts).execute()
}

export const updateSubscriber = async (
  id: string,
  username: string,
  passwordHash: string | undefined,
  roles: string[]
) => {
  const updateValue: { username: string; passwordHash?: string | undefined } = {
    username
  }
  if (passwordHash) {
    updateValue['passwordHash'] = passwordHash
  }

  await db.update(user).set(updateValue).where(eq(user.id, id)).execute()
  // clear all existing roles
  await db.delete(subscriberToRole).where(eq(subscriberToRole.subscriberId, id)).execute()

  if (roles.length === 0) {
    return
  }

  // then insert the new rules
  const inserts = roles.map(roleId => {
    return {
      roleId,
      subscriberId: id
    }
  })
  await db.insert(subscriberToRole).values(inserts).execute()
}

export const deleteSubscriber = async (id: string) => {
  await db.delete(subscriber).where(eq(subscriber.id, id)).execute()
  await db.delete(user).where(eq(user.id, id)).execute()
}

export const findRoles = async () => {
  return db.query.role.findMany().execute()
}

export const findRole = async (id: string) => {
  return db.query.role
    .findFirst({
      where: eq(role.id, id)
    })
    .execute()
}

export const createRole = async (name: string, parentId: string | null) => {
  const id = generateUUID()
  await db.insert(role).values({ id, name, parentId }).execute()
}

export const updateRole = async (
  id: string,
  name: string,
  parentId: string | null
) => {
  await db.update(role).set({ name, parentId }).where(eq(role.id, id)).execute()
}

export const deleteRole = async (id: string) => {
  await db.delete(role).where(eq(role.id, id)).execute()
}

export const saveTwoFactorSecret = async (userId: string, hexSecret: string) => {
  await db.update(user).set({ twoFactorSecret: hexSecret }).where(eq(user.id, userId)).execute()
}

export const removeTwoFactorSecret = async (userId: string) => {
  await db.update(user).set({ twoFactorSecret: null }).where(eq(user.id, userId)).execute()
}

export const createPosting = async (
  title: string,
  description: string,
  content: string,
  visibility: Visibility
) => {
  const id = generateUUID()

  const fixedRefContent = replaceImageRefs(id, content)

  await db
    .insert(posting)
    .values({ id, title, description, content: fixedRefContent, visibility })
    .execute()

  return id
}

export const updatePosting = async (
  id: string,
  title: string,
  description: string,
  content: string,
  visibility: Visibility
) => {
  await db
    .update(posting)
    .set({ title, description, content, visibility })
    .where(eq(posting.id, id))
    .execute()
}

export const deletePosting = async (id: string) => {
  await db.delete(posting).where(eq(posting.id, id)).execute()
}

export const findPostingsForUser = async (userId: string | undefined) => {
  // Without a user , only display public posts.
  if (!userId) {
    return db.query.posting
      .findMany({
        where: eq(posting.visibility, Visibility.Public)
      })
      .execute()
  }

  // If there is a user (admin or subscriber, doesn't matter), show all posts.
  return db.query.posting.findMany().execute()
}

export const findPosting = async (id: string) => {
  return db.query.posting
    .findFirst({
      where: eq(posting.id, id)
    })
    .execute()
}

export const generateUUID = () => {
  // ID with 120 bits of entropy, or about the same as UUID v4.
  const bytes = crypto.getRandomValues(new Uint8Array(15))
  return encodeBase32LowerCase(bytes)
}
