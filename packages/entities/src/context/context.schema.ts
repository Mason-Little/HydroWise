import { z } from "zod";

export const ContextSchema = z.object({
  content: z.string(),
  similarity: z.number(),
});

export type Context = z.infer<typeof ContextSchema>;
