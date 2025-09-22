ALTER TABLE "feeds" ADD COLUMN "last_fetched_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "feed_follows" DROP COLUMN "last_fetched_at";