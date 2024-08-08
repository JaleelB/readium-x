CREATE TABLE `app_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`account_type` text NOT NULL,
	`github_id` text,
	`google_id` text,
	`password` text,
	`salt` text,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `app_bookmark` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`title` text NOT NULL,
	`html_content` text NOT NULL,
	`text_content` text NOT NULL,
	`author_name` text NOT NULL,
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
CREATE TABLE `app_magic_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`token` text,
	`token_expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `app_profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`display_name` text,
	`image_id` text,
	`image` text,
	`bio` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `app_reading_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
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
CREATE TABLE `app_reset_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token` text,
	`token_expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `app_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `app_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text,
	`email_verified` integer
);
--> statement-breakpoint
CREATE TABLE `app_verify_email_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token` text,
	`token_expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `app_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_accounts_user_id_unique` ON `app_accounts` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `app_accounts_github_id_unique` ON `app_accounts` (`github_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `app_accounts_google_id_unique` ON `app_accounts` (`google_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `app_magic_links_email_unique` ON `app_magic_links` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `app_profile_user_id_unique` ON `app_profile` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `app_reset_tokens_user_id_unique` ON `app_reset_tokens` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `app_user_email_unique` ON `app_user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `app_verify_email_tokens_user_id_unique` ON `app_verify_email_tokens` (`user_id`);