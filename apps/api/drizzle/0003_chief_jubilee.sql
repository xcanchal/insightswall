CREATE TYPE "public"."suggestion_category" AS ENUM('FEATURE', 'BUG');--> statement-breakpoint
ALTER TABLE "suggestions" ADD COLUMN "category" "suggestion_category" NOT NULL;