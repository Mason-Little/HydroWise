ALTER TABLE "courses" ADD COLUMN "course_details" jsonb;--> statement-breakpoint
UPDATE "courses" SET "course_details" = jsonb_build_object(
  'term', "term",
  'schedule', "schedule",
  'prerequisites', "prerequisites",
  'textbook', "textbook",
  'credits', "credits"
);--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "course_details" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "term";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "schedule";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "prerequisites";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "textbook";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "credits";
