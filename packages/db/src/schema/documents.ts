import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { chapters } from "@/schema/chapters";
import { courses } from "@/schema/courses";
import { topics } from "@/schema/topics";

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  chapterId: uuid("chapter_id")
    .notNull()
    .references(() => chapters.id, { onDelete: "cascade" }),
  topicId: uuid("topic_id").references(() => topics.id, {
    onDelete: "set null",
  }),
  totalPages: integer("total_pages").notNull(),
});
