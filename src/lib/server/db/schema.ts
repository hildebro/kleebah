import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const posting = sqliteTable('posting', {
  id: text().primaryKey(),
  content: text()
});

export type Posting = typeof posting.$inferSelect;
