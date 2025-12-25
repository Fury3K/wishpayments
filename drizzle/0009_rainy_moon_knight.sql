ALTER TABLE "users" ADD COLUMN "wallet_name" text DEFAULT 'WishPay Wallet' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_wallet_hidden" boolean DEFAULT false NOT NULL;