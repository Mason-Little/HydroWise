import { z } from "zod";

export const EmbeddingSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  content: z.string(),
  embedding: z.array(z.number()),
  chunkIndex: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const EmbeddingChunkSchema = z.object({
  content: z.string(),
  embedding: z.array(z.number()),
  chunkIndex: z.number(),
});

export const CreateEmbeddingRequestSchema = z.object({
  documentId: z.string(),
  content: z.string(),
  embedding: z.array(z.number()),
  topicId: z.string(),
  chunkIndex: z.number(),
});

export type Embedding = z.infer<typeof EmbeddingSchema>;
export type EmbeddingChunk = z.infer<typeof EmbeddingChunkSchema>;
export type CreateEmbeddingRequest = z.infer<
  typeof CreateEmbeddingRequestSchema
>;
