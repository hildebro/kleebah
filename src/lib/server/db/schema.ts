import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const user = sqliteTable('user', {
  id: text().primaryKey(),
  username: text().notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  twoFactorSecret: text('two_factor_secret'),
  rssToken: text('rss_token')
})

export type User = typeof user.$inferSelect

export const admin = sqliteTable('admin', {
  id: text()
    .notNull()
    .references(() => user.id)
    .primaryKey()
})

export type Admin = typeof admin.$inferSelect

export const adminRelations = relations(admin, ({ one }) => ({
  user: one(user, {
    fields: [admin.id],
    references: [user.id]
  })
}))

export const subscriber = sqliteTable('subscriber', {
  id: text()
    .notNull()
    .references(() => user.id)
    .primaryKey()
})

export type Subscriber = typeof subscriber.$inferSelect

export const subscriberRelations = relations(subscriber, ({ one }) => ({
  user: one(user, {
    fields: [subscriber.id],
    references: [user.id]
  })
}))

export const session = sqliteTable('session', {
  id: text().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  twoFactorVerified: integer('two_factor_verified', { mode: 'boolean' }).notNull().default(false)
})

export type Session = typeof session.$inferSelect

export const posting = sqliteTable('posting', {
  id: text().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
  description: text(),
  pubDate: text().notNull().default('sql`(CURRENT_TIMESTAMP)`'),
  visibility: text().notNull()
})

export type Posting = typeof posting.$inferSelect

export enum Visibility {
  Public = 'public',
  Subscribers = 'subscribers'
}
