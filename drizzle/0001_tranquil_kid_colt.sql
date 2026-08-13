CREATE TABLE `authors` (
	`id` varchar(24) NOT NULL,
	`account_id` varchar(36),
	`slug` varchar(220) NOT NULL,
	`name` varchar(200) NOT NULL,
	`english_name` varchar(200),
	`kind` enum('classic','current','translator','editor','organization','anonymous') NOT NULL DEFAULT 'current',
	`bio` text,
	`long_bio` longtext,
	`portrait_url` text,
	`birth_date` datetime,
	`death_date` datetime,
	`pen_names` json NOT NULL DEFAULT (JSON_ARRAY()),
	`literary_period` varchar(160),
	`genres` json NOT NULL DEFAULT (JSON_ARRAY()),
	`public_domain` boolean NOT NULL DEFAULT false,
	`copyright_note` text,
	`verified` boolean NOT NULL DEFAULT false,
	`featured` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `authors_id` PRIMARY KEY(`id`),
	CONSTRAINT `authors_account_id_unique` UNIQUE(`account_id`),
	CONSTRAINT `authors_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` varchar(24) NOT NULL,
	`work_id` varchar(24),
	`series_id` varchar(24),
	`slug` varchar(220) NOT NULL,
	`title` varchar(300) NOT NULL,
	`subtitle` varchar(500),
	`description` text,
	`edition_label` varchar(160),
	`isbn` varchar(40),
	`language` varchar(32) NOT NULL DEFAULT 'bn',
	`volume_order` int NOT NULL DEFAULT 0,
	`cover_url` text,
	`status` enum('planned','ongoing','completed','paused','cancelled') NOT NULL DEFAULT 'planned',
	`visibility` enum('public','unlisted','private') NOT NULL DEFAULT 'public',
	`copyright_notice` text,
	`created_by_id` varchar(36) NOT NULL,
	`published_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `books_id` PRIMARY KEY(`id`),
	CONSTRAINT `books_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `chapter_revisions` (
	`id` varchar(24) NOT NULL,
	`chapter_id` varchar(24) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`title` varchar(300) NOT NULL,
	`document` json NOT NULL,
	`rendered_html` longtext NOT NULL,
	`change_note` varchar(300),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `chapter_revisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chapters` (
	`id` varchar(24) NOT NULL,
	`book_id` varchar(24) NOT NULL,
	`slug` varchar(220) NOT NULL,
	`chapter_number` varchar(32),
	`position` int NOT NULL DEFAULT 0,
	`type` enum('chapter','prologue','interlude','epilogue','appendix') NOT NULL DEFAULT 'chapter',
	`title` varchar(300) NOT NULL,
	`subtitle` varchar(500),
	`excerpt` text,
	`document` json NOT NULL,
	`rendered_html` longtext NOT NULL,
	`plain_text` longtext NOT NULL,
	`table_of_contents` json NOT NULL,
	`word_count` int NOT NULL DEFAULT 0,
	`status` enum('draft','review','scheduled','published','archived') NOT NULL DEFAULT 'draft',
	`visibility` enum('public','unlisted','private') NOT NULL DEFAULT 'public',
	`created_by_id` varchar(36) NOT NULL,
	`published_at` datetime,
	`scheduled_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `chapters_id` PRIMARY KEY(`id`),
	CONSTRAINT `chapters_book_slug_unique` UNIQUE(`book_id`,`slug`),
	CONSTRAINT `chapters_book_position_unique` UNIQUE(`book_id`,`position`)
);
--> statement-breakpoint
CREATE TABLE `contributions` (
	`id` varchar(24) NOT NULL,
	`entity_type` enum('release','work','series','book','chapter') NOT NULL,
	`entity_id` varchar(24) NOT NULL,
	`author_id` varchar(24) NOT NULL,
	`role` enum('author','co_author','translator','editor','compiler','illustrator','introduction','researcher','photographer','narrator','rights_holder') NOT NULL DEFAULT 'author',
	`display_order` int NOT NULL DEFAULT 0,
	`custom_byline` varchar(200),
	`approval_status` enum('not_required','pending','approved','changes_requested') NOT NULL DEFAULT 'not_required',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `contributions_id` PRIMARY KEY(`id`),
	CONSTRAINT `contributions_entity_author_role` UNIQUE(`entity_type`,`entity_id`,`author_id`,`role`)
);
--> statement-breakpoint
CREATE TABLE `reading_progress` (
	`user_id` varchar(36) NOT NULL,
	`book_id` varchar(24) NOT NULL,
	`chapter_id` varchar(24),
	`locator` varchar(220),
	`percent` int NOT NULL DEFAULT 0,
	`completed` boolean NOT NULL DEFAULT false,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `reading_progress_user_id_book_id_pk` PRIMARY KEY(`user_id`,`book_id`)
);
--> statement-breakpoint
CREATE TABLE `series` (
	`id` varchar(24) NOT NULL,
	`slug` varchar(220) NOT NULL,
	`title` varchar(300) NOT NULL,
	`subtitle` varchar(500),
	`description` text,
	`cover_url` text,
	`banner_url` text,
	`accent_color` varchar(24),
	`status` enum('planned','ongoing','completed','paused','cancelled') NOT NULL DEFAULT 'planned',
	`visibility` enum('public','unlisted','private') NOT NULL DEFAULT 'public',
	`language` varchar(32) NOT NULL DEFAULT 'bn',
	`content_warnings` json NOT NULL DEFAULT (JSON_ARRAY()),
	`created_by_id` varchar(36) NOT NULL,
	`published_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `series_id` PRIMARY KEY(`id`),
	CONSTRAINT `series_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `works` (
	`id` varchar(24) NOT NULL,
	`slug` varchar(220) NOT NULL,
	`title` varchar(300) NOT NULL,
	`original_title` varchar(300),
	`type` enum('novel','novella','story','poem','essay','collection','research','other') NOT NULL DEFAULT 'novel',
	`description` text,
	`original_language` varchar(32) NOT NULL DEFAULT 'bn',
	`first_published_at` datetime,
	`public_domain` boolean NOT NULL DEFAULT false,
	`copyright_notice` text,
	`created_by_id` varchar(36) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `works_id` PRIMARY KEY(`id`),
	CONSTRAINT `works_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `role` enum('owner','admin','managing_editor','editor','writer','contributor','reader') NOT NULL DEFAULT 'reader';--> statement-breakpoint
ALTER TABLE `posts` ADD `subtitle` varchar(500);--> statement-breakpoint
ALTER TABLE `posts` ADD `kicker` varchar(160);--> statement-breakpoint
ALTER TABLE `posts` ADD `release_type` enum('story','poem','essay','article','review','interview','note','announcement') DEFAULT 'article' NOT NULL;--> statement-breakpoint
ALTER TABLE `authors` ADD CONSTRAINT `authors_account_id_user_id_fk` FOREIGN KEY (`account_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `books` ADD CONSTRAINT `books_work_id_works_id_fk` FOREIGN KEY (`work_id`) REFERENCES `works`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `books` ADD CONSTRAINT `books_series_id_series_id_fk` FOREIGN KEY (`series_id`) REFERENCES `series`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `books` ADD CONSTRAINT `books_created_by_id_user_id_fk` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chapter_revisions` ADD CONSTRAINT `chapter_revisions_chapter_id_chapters_id_fk` FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chapter_revisions` ADD CONSTRAINT `chapter_revisions_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chapters` ADD CONSTRAINT `chapters_book_id_books_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chapters` ADD CONSTRAINT `chapters_created_by_id_user_id_fk` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contributions` ADD CONSTRAINT `contributions_author_id_authors_id_fk` FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reading_progress` ADD CONSTRAINT `reading_progress_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reading_progress` ADD CONSTRAINT `reading_progress_book_id_books_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reading_progress` ADD CONSTRAINT `reading_progress_chapter_id_chapters_id_fk` FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `series` ADD CONSTRAINT `series_created_by_id_user_id_fk` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `works` ADD CONSTRAINT `works_created_by_id_user_id_fk` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `authors_kind_name_idx` ON `authors` (`kind`,`name`);--> statement-breakpoint
CREATE INDEX `authors_featured_idx` ON `authors` (`featured`);--> statement-breakpoint
CREATE INDEX `books_series_order_idx` ON `books` (`series_id`,`volume_order`);--> statement-breakpoint
CREATE INDEX `books_status_date_idx` ON `books` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `chapter_revisions_chapter_date_idx` ON `chapter_revisions` (`chapter_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `chapters_book_status_idx` ON `chapters` (`book_id`,`status`,`position`);--> statement-breakpoint
CREATE INDEX `contributions_entity_order_idx` ON `contributions` (`entity_type`,`entity_id`,`display_order`);--> statement-breakpoint
CREATE INDEX `contributions_author_idx` ON `contributions` (`author_id`);--> statement-breakpoint
CREATE INDEX `series_status_date_idx` ON `series` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `posts_release_type_idx` ON `posts` (`release_type`,`published_at`);