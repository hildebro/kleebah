ALTER TABLE `posting` ADD `title` text NOT NULL;--> statement-breakpoint
ALTER TABLE `posting` ADD `description` text;--> statement-breakpoint
ALTER TABLE `posting` ADD `pubDate` text DEFAULT (CURRENT_DATE) NOT NULL;