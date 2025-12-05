PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_posting` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`description` text,
	`pubDate` text DEFAULT 'sql`(CURRENT_TIMESTAMP)`' NOT NULL,
	`visibility` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_posting`("id", "title", "content", "description", "pubDate", "visibility") SELECT "id", "title", "content", "description", "pubDate", "visibility" FROM `posting`;--> statement-breakpoint
DROP TABLE `posting`;--> statement-breakpoint
ALTER TABLE `__new_posting` RENAME TO `posting`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `user` ADD `rss_token` text;