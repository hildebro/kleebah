PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_subscriber_to_role` (
	`subscriberId` text NOT NULL,
	`roleId` text NOT NULL,
	PRIMARY KEY(`subscriberId`, `roleId`),
	FOREIGN KEY (`subscriberId`) REFERENCES `subscriber`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_subscriber_to_role`("subscriberId", "roleId") SELECT "subscriberId", "roleId" FROM `subscriber_to_role`;--> statement-breakpoint
DROP TABLE `subscriber_to_role`;--> statement-breakpoint
ALTER TABLE `__new_subscriber_to_role` RENAME TO `subscriber_to_role`;--> statement-breakpoint
PRAGMA foreign_keys=ON;