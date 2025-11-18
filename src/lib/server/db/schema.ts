import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const posting = sqliteTable('posting', {
  id: text().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
  description: text(),
  pubDate: text().notNull().default(sql`(CURRENT_DATE)`)
});

export type Posting = typeof posting.$inferSelect;
