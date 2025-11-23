import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const user = sqliteTable('user', {
  id: text().primaryKey(),
  username: text().notNull().unique(),
  passwordHash: text('password_hash').notNull()
})

export type User = typeof user.$inferSelect

export const admin = sqliteTable('admin', {
  id: text()
    .notNull()
    .references(() => user.id)
    .primaryKey(),
})

export type Admin = typeof admin.$inferSelect

export const session = sqliteTable('session', {
  id: text().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
})

export type Session = typeof session.$inferSelect

export const posting = sqliteTable('posting', {
  id: text().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
  description: text(),
  pubDate: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
})

export type Posting = typeof posting.$inferSelect
