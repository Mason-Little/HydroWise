import { z } from "zod";

export const TopicSchema = z.object({
  id: z.string(),
  userId: z.string(),
  courseId: z.string(),
  chapterId: z.string().optional(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
});

export type Topic = z.infer<typeof TopicSchema>;
