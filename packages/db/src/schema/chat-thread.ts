import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { courses } from "@/schema/courses";

export const chatThreads = pgTable("chat_threads", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id")
    .references(() => courses.id, { onDelete: "cascade" }),
  title: text("title"),
});
