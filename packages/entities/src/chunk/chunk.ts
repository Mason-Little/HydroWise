import { z } from "zod";

export const ChunkSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  chunkConcept: z.string(),
  chunkContent: z.string(),
  chunkEmbedding: z.array(z.number()),
});

export const CreateChunkInputSchema = ChunkSchema.pick({
  documentId: true,
  chunkConcept: true,
  chunkContent: true,
  chunkEmbedding: true,
});

export type Chunk = z.infer<typeof ChunkSchema>;
export type CreateChunkInput = z.infer<typeof CreateChunkInputSchema>;
