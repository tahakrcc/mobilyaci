CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"url" text NOT NULL,
	"alt_tr" text DEFAULT '' NOT NULL,
	"alt_en" text DEFAULT '' NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "media_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "order_events" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"status" text NOT NULL,
	"public_note" text DEFAULT '' NOT NULL,
	"internal_note" text DEFAULT '' NOT NULL,
	"media_url" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"tracking_token" text NOT NULL,
	"locale" text DEFAULT 'tr' NOT NULL,
	"customer_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"city" text NOT NULL,
	"product_type" text NOT NULL,
	"wood_type" text NOT NULL,
	"epoxy" text NOT NULL,
	"leg_style" text NOT NULL,
	"dimensions" text NOT NULL,
	"finish" text NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"reference_url" text,
	"status" text DEFAULT 'received' NOT NULL,
	"estimated_delivery" text,
	"quoted_amount" integer,
	"currency" text DEFAULT 'TRY' NOT NULL,
	"admin_notes" text DEFAULT '' NOT NULL,
	"notification_status" text DEFAULT 'pending' NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number"),
	CONSTRAINT "orders_tracking_token_unique" UNIQUE("tracking_token")
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"locale" text NOT NULL,
	"type" text DEFAULT 'text' NOT NULL,
	"value" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_events" ADD CONSTRAINT "order_events_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_events_order_id_idx" ON "order_events" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "orders_email_idx" ON "orders" USING btree ("email");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "site_content_key_locale_unique" ON "site_content" USING btree ("key","locale");