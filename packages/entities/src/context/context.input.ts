import { z } from "zod";

export const ContextQueryInputSchema = z.object({
  embedding: z.array(z.number()),
});

export type ContextQueryInput = z.infer<typeof ContextQueryInputSchema>;
