CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`filename` text NOT NULL,
	`mime_type` text NOT NULL,
	`alt_tr` text DEFAULT '' NOT NULL,
	`alt_en` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_key_unique` ON `media` (`key`);--> statement-breakpoint
CREATE TABLE `order_events` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`status` text NOT NULL,
	`public_note` text DEFAULT '' NOT NULL,
	`internal_note` text DEFAULT '' NOT NULL,
	`media_url` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order_number` text NOT NULL,
	`tracking_token` text NOT NULL,
	`locale` text DEFAULT 'tr' NOT NULL,
	`customer_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`city` text NOT NULL,
	`product_type` text NOT NULL,
	`wood_type` text NOT NULL,
	`epoxy` text NOT NULL,
	`leg_style` text NOT NULL,
	`dimensions` text NOT NULL,
	`finish` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`reference_url` text,
	`status` text DEFAULT 'received' NOT NULL,
	`estimated_delivery` text,
	`quoted_amount` integer,
	`currency` text DEFAULT 'TRY' NOT NULL,
	`admin_notes` text DEFAULT '' NOT NULL,
	`notification_status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_number_unique` ON `orders` (`order_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_tracking_token_unique` ON `orders` (`tracking_token`);--> statement-breakpoint
CREATE TABLE `site_content` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`locale` text NOT NULL,
	`type` text DEFAULT 'text' NOT NULL,
	`value` text NOT NULL,
	`updated_at` text NOT NULL
);
