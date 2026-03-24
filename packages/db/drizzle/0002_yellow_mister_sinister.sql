ALTER TABLE "documents" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "course_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "file_type";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "embedding_status";--> statement-breakpoint
DROP TYPE "public"."embedding_status";--> statement-breakpoint
DROP TYPE "public"."file_type";