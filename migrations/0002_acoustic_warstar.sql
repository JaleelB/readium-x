DROP TABLE IF EXISTS `app_accounts`;--> statement-breakpoint
DROP TABLE IF EXISTS `app_magic_links`;--> statement-breakpoint
DROP TABLE IF EXISTS `app_reset_tokens`;--> statement-breakpoint
DROP TABLE IF EXISTS `app_session`;--> statement-breakpoint
DROP TABLE IF EXISTS `app_verify_email_tokens`;--> statement-breakpoint
DROP TABLE IF EXISTS `app_bookmark`;--> statement-breakpoint
DROP TABLE IF EXISTS `app_profile`;--> statement-breakpoint
DROP TABLE IF EXISTS `app_reading_history`;--> statement-breakpoint
DROP TABLE IF EXISTS `app_user`;--> statement-breakpoint
CREATE TABLE `app_user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`openai_api_key` text
);
--> statement-breakpoint
CREATE TABLE `app_profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`display_name` text,
	`image_id` text,
	`image` text,
	`bio` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `app_bookmark` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`html_content` text NOT NULL,
	`text_content` text NOT NULL,
	`author_name` text,
	`author_image_url` text,
	`author_profile_url` text,
	`article_url` text NOT NULL,
	`publication_name` text,
	`read_time` text,
	`publish_date` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `app_reading_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`author_name` text NOT NULL,
	`article_url` text NOT NULL,
	`article_title` text NOT NULL,
	`author_image_url` text,
	`author_profile_url` text,
	`read_time` text NOT NULL,
	`access_time` integer NOT NULL,
	`progress` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_user_email_unique` ON `app_user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `app_profile_user_id_unique` ON `app_profile` (`user_id`);
