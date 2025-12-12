CREATE TABLE `posting_to_role` (
	`postingId` text NOT NULL,
	`roleId` text NOT NULL,
	PRIMARY KEY(`postingId`, `roleId`),
	FOREIGN KEY (`postingId`) REFERENCES `posting`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON UPDATE no action ON DELETE no action
);
