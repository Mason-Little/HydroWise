import { z } from "zod";

const NonEmptyStringSchema = z.string().min(1);

export const ChunkConceptResultSchema = z.object({
  idea: NonEmptyStringSchema,
});

export type ChunkConceptResult = z.infer<typeof ChunkConceptResultSchema>;
