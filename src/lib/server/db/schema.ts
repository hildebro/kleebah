import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull()
})

export type Session = typeof session.$inferSelect

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
})

export type User = typeof user.$inferSelect

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
