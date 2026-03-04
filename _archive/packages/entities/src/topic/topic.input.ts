import { z } from "zod";

export const TopicCreateInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  courseId: z.string(),
  chapterId: z.string().optional(),
});

export type TopicCreateInput = z.infer<typeof TopicCreateInputSchema>;

export const TopicQueryInputSchema = z.object({
  courseId: z.string(),
  chapterId: z.string().optional(),
});

export type TopicQueryInput = z.infer<typeof TopicQueryInputSchema>;
