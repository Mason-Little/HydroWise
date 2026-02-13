import { z } from "zod";

export const EmbeddingCreateInputSchema = z.object({
  documentId: z.string(),
  content: z.string(),
  embedding: z.array(z.number()),
  topicId: z.string().nullable(),
  chunkIndex: z.number(),
  chunkIdea: z.string(),
});

export type EmbeddingCreateInput = z.infer<typeof EmbeddingCreateInputSchema>;
