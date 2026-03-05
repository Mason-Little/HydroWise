import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { chapters } from "./chapters";
import { topics } from "./topics";

export const fileTypeEnum = pgEnum("file_type", [
  "pdf",
  "docx",
  "pptx",
  "md",
  "image",
]);

export const embeddingStatusEnum = pgEnum("embedding_status", [
  "pending",
  "completed",
  "failed",
]);

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  chapterId: uuid("chapter_id")
    .notNull()
    .references(() => chapters.id, { onDelete: "cascade" }),
  topicId: uuid("topic_id").references(() => topics.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  fileType: fileTypeEnum("file_type").notNull(),
  embeddingStatus: embeddingStatusEnum("embedding_status")
    .notNull()
    .default("pending"),
});
