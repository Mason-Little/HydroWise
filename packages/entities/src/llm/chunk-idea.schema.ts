import { z } from "zod";

const NonEmptyStringSchema = z.string().min(1);

export const ChunkIdeaResultSchema = z.object({
  idea: NonEmptyStringSchema,
});

export type ChunkIdeaResult = z.infer<typeof ChunkIdeaResultSchema>;
