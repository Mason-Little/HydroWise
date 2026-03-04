import { z } from "zod";

export const ChapterCreateInputSchema = z.object({
  name: z.string(),
  courseId: z.string().min(1),
});

export type ChapterCreateInput = z.infer<typeof ChapterCreateInputSchema>;
