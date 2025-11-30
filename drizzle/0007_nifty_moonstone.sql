CREATE TABLE `subscriber` (
	`id` text PRIMARY KEY NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
