PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_posting` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_posting`("id", "content") SELECT "id", "content" FROM `posting`;--> statement-breakpoint
DROP TABLE `posting`;--> statement-breakpoint
ALTER TABLE `__new_posting` RENAME TO `posting`;--> statement-breakpoint
PRAGMA foreign_keys=ON;