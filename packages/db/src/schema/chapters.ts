import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { courses } from "./courses";

export const chapters = pgTable("chapters", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  chapterName: text("chapter_name").notNull(),
  chapterDescription: text("chapter_description").notNull(),
});
