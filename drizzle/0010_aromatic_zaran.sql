CREATE TABLE `role` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`parentId` text,
	FOREIGN KEY (`parentId`) REFERENCES `role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subscriber_to_role` (
	`subscriberId` integer NOT NULL,
	`roleId` integer NOT NULL,
	PRIMARY KEY(`subscriberId`, `roleId`),
	FOREIGN KEY (`subscriberId`) REFERENCES `subscriber`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON UPDATE no action ON DELETE no action
);
