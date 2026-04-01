import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { chapters } from "./chapters";
import { courses } from "./courses";
import { topics } from "./topics";

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
});
