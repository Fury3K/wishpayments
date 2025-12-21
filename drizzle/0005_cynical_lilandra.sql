ALTER TABLE "users" DROP CONSTRAINT "users_apple_id_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "facebook_id" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "apple_id";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_facebook_id_unique" UNIQUE("facebook_id");