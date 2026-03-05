import { pgTable, text, uuid, vector } from "drizzle-orm/pg-core";
import { documents } from "./documents";

export const chunks = pgTable("chunks", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  chunkConcept: text("chunk_concept").notNull(),
  chunkContent: text("chunk_content").notNull(),
  chunkEmbedding: vector("chunk_embedding", { dimensions: 768 }).notNull(),
});
