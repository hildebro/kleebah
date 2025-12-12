CREATE TABLE `invite_link` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer
);
--> statement-breakpoint
CREATE TABLE `invite_link_to_role` (
	`inviteLinkId` text NOT NULL,
	`roleId` text NOT NULL,
	PRIMARY KEY(`inviteLinkId`, `roleId`),
	FOREIGN KEY (`inviteLinkId`) REFERENCES `invite_link`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON UPDATE no action ON DELETE no action
);
