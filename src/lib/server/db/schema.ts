import {
  type AnySQLiteColumn,
  integer,
  primaryKey,
  sqliteTable,
  text
} from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const systemState = sqliteTable('system_state', {
  key: text().primaryKey(),
  value: text(),
  updatedAt: integer({ mode: 'timestamp' })
})

export type SystemState = typeof systemState.$inferSelect

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

export const subscriberRelations = relations(subscriber, ({ one, many }) => ({
  user: one(user, {
    fields: [subscriber.id],
    references: [user.id]
  }),
  subscribersToRoles: many(subscriberToRole)
}))

export const role = sqliteTable('role', {
  id: text().primaryKey(),
  name: text().notNull(),
  // Explicit typing required for self-referential foreign keys.
  parentId: text().references((): AnySQLiteColumn => role.id)
})

export type Role = typeof role.$inferSelect

export const roleRelations = relations(role, ({ one, many }) => ({
  subscribers: many(subscriber),
  parent: one(role)
}))

export const subscriberToRole = sqliteTable(
  'subscriber_to_role',
  {
    subscriberId: text()
      .notNull()
      .references(() => subscriber.id),
    roleId: text()
      .notNull()
      .references(() => role.id)
  },
  (t) => [primaryKey({ columns: [t.subscriberId, t.roleId] })]
)

export const subscriberToRoleRelations = relations(subscriberToRole, ({ one }) => ({
  subscriber: one(subscriber, {
    fields: [subscriberToRole.subscriberId],
    references: [subscriber.id],
  }),
  roles: one(role, {
    fields: [subscriberToRole.roleId],
    references: [role.id],
  }),
}));

export const inviteLink = sqliteTable('invite_link', {
  id: text().primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
})

export const inviteLinkToRole = sqliteTable(
  'invite_link_to_role',
  {
    inviteLinkId: text()
      .notNull()
      .references(() => inviteLink.id),
    roleId: text()
      .notNull()
      .references(() => role.id)
  },
  (t) => [primaryKey({ columns: [t.inviteLinkId, t.roleId] })]
)

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

export const postingRelations = relations(posting, ({ many }) => ({
  postingToRole: many(postingToRole)
}))

export const postingToRole = sqliteTable(
  'posting_to_role',
  {
    postingId: text()
      .notNull()
      .references(() => posting.id),
    roleId: text()
      .notNull()
      .references(() => role.id)
  },
  (t) => [primaryKey({ columns: [t.postingId, t.roleId] })]
)

export const postingToRoleRelations = relations(postingToRole, ({ one }) => ({
  posting: one(posting, {
    fields: [postingToRole.postingId],
    references: [posting.id],
  }),
  roles: one(role, {
    fields: [postingToRole.roleId],
    references: [role.id],
  }),
}));


export enum Visibility {
  Public = 'public',
  Subscribers = 'subscribers',
  Roles = 'roles'
}
