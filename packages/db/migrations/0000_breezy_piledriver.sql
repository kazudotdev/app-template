CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`content` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP,
	`private` integer DEFAULT false
);
