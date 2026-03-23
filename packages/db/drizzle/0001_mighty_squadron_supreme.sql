ALTER TABLE "courses" ALTER COLUMN "grade_rubric" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "test_dates" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "term" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "credits" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "prerequisites" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "textbook" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "schedule" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "grade_scale" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "policies" jsonb DEFAULT '[]'::jsonb NOT NULL;