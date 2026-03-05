import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { chapters } from "./chapters";

export const topics = pgTable("topics", {
  id: uuid("id").defaultRandom().primaryKey(),
  chapterId: uuid("chapter_id")
    .notNull()
    .references(() => chapters.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
});
