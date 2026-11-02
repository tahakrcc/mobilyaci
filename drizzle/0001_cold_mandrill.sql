CREATE TABLE "admin_credentials" (
	"id" text PRIMARY KEY NOT NULL,
	"password_hash" text NOT NULL,
	"session_version" text NOT NULL,
	"updated_at" text NOT NULL
);
