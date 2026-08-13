CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`userId` varchar(36) NOT NULL,
	`accountId` varchar(255) NOT NULL,
	`providerId` varchar(100) NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`accessTokenExpiresAt` datetime,
	`refreshTokenExpiresAt` datetime,
	`scope` text,
	`idToken` text,
	`password` text,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookmarks` (
	`post_id` varchar(24) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bookmarks_post_id_user_id_pk` PRIMARY KEY(`post_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` varchar(24) NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`description` text,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` varchar(24) NOT NULL,
	`post_id` varchar(24) NOT NULL,
	`user_id` varchar(36),
	`parent_id` varchar(24),
	`guest_name` varchar(120),
	`guest_email` varchar(320),
	`body` text NOT NULL,
	`status` enum('pending','approved','spam','deleted') NOT NULL DEFAULT 'pending',
	`likes` int NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` varchar(24) NOT NULL,
	`owner_id` varchar(36) NOT NULL,
	`filename` varchar(255) NOT NULL,
	`storage_path` varchar(500) NOT NULL,
	`mime_type` varchar(100) NOT NULL,
	`size` int NOT NULL,
	`width` int,
	`height` int,
	`alt` varchar(500),
	`caption` text,
	`metadata` json,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patterns` (
	`id` varchar(24) NOT NULL,
	`name` varchar(160) NOT NULL,
	`description` text,
	`document` json NOT NULL,
	`owner_id` varchar(36) NOT NULL,
	`is_shared` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `patterns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_authors` (
	`post_id` varchar(24) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`byline_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `post_authors_post_id_user_id_pk` PRIMARY KEY(`post_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `post_categories` (
	`post_id` varchar(24) NOT NULL,
	`category_id` varchar(24) NOT NULL,
	CONSTRAINT `post_categories_post_id_category_id_pk` PRIMARY KEY(`post_id`,`category_id`)
);
--> statement-breakpoint
CREATE TABLE `post_tags` (
	`post_id` varchar(24) NOT NULL,
	`tag_id` varchar(24) NOT NULL,
	CONSTRAINT `post_tags_post_id_tag_id_pk` PRIMARY KEY(`post_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` varchar(24) NOT NULL,
	`slug` varchar(220) NOT NULL,
	`title` varchar(300) NOT NULL,
	`excerpt` text,
	`document` json NOT NULL,
	`rendered_html` longtext NOT NULL,
	`plain_text` longtext NOT NULL,
	`table_of_contents` json NOT NULL,
	`status` enum('draft','review','scheduled','published','archived') NOT NULL DEFAULT 'draft',
	`visibility` enum('public','unlisted','private') NOT NULL DEFAULT 'public',
	`author_id` varchar(36) NOT NULL,
	`featured_media_id` varchar(24),
	`published_at` datetime,
	`scheduled_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `reactions` (
	`id` varchar(24) NOT NULL,
	`post_id` varchar(24) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`kind` enum('clap','like') NOT NULL DEFAULT 'clap',
	`amount` int NOT NULL DEFAULT 1,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `reactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `reactions_user_post_kind` UNIQUE(`post_id`,`user_id`,`kind`)
);
--> statement-breakpoint
CREATE TABLE `post_revisions` (
	`id` varchar(24) NOT NULL,
	`post_id` varchar(24) NOT NULL,
	`author_id` varchar(36) NOT NULL,
	`title` varchar(300) NOT NULL,
	`document` json NOT NULL,
	`rendered_html` longtext NOT NULL,
	`change_note` varchar(300),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `post_revisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`userId` varchar(36) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expiresAt` datetime NOT NULL,
	`ipAddress` varchar(64),
	`userAgent` text,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` varchar(120) NOT NULL,
	`value` json NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` varchar(24) NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(120) NOT NULL,
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`emailVerified` boolean NOT NULL DEFAULT false,
	`image` text,
	`role` enum('owner','editor','writer','contributor') NOT NULL DEFAULT 'writer',
	`username` varchar(80),
	`bio` text,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expiresAt` datetime NOT NULL,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `media` ADD CONSTRAINT `media_owner_id_user_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patterns` ADD CONSTRAINT `patterns_owner_id_user_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_authors` ADD CONSTRAINT `post_authors_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_authors` ADD CONSTRAINT `post_authors_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_categories` ADD CONSTRAINT `post_categories_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_categories` ADD CONSTRAINT `post_categories_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_tags` ADD CONSTRAINT `post_tags_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_tags` ADD CONSTRAINT `post_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_author_id_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reactions` ADD CONSTRAINT `reactions_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reactions` ADD CONSTRAINT `reactions_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_revisions` ADD CONSTRAINT `post_revisions_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_revisions` ADD CONSTRAINT `post_revisions_author_id_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `account_user_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE INDEX `comments_post_status_idx` ON `comments` (`post_id`,`status`);--> statement-breakpoint
CREATE INDEX `posts_status_date_idx` ON `posts` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `posts_author_idx` ON `posts` (`author_id`);--> statement-breakpoint
CREATE INDEX `revisions_post_date_idx` ON `post_revisions` (`post_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `session_user_idx` ON `session` (`userId`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);