import { z } from "zod";

export const ContextSchema = z.object({
  content: z.string(),
  similarity: z.number(),
});

export type Context = z.infer<typeof ContextSchema>;

export const RetrieveContextRequestSchema = z.object({
  embedding: z.array(z.number()),
});

export type RetrieveContextRequest = z.infer<
  typeof RetrieveContextRequestSchema
>;

export const RetrieveContextResponseSchema = z.array(ContextSchema);

export type RetrieveContextResponse = z.infer<
  typeof RetrieveContextResponseSchema
>;
