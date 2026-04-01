import { z } from "zod";

export const TopicSchema = z.object({
  id: z.string(),
  chapterId: z.string(),
  name: z.string(),
  description: z.string(),
});

export const CreateTopicInputSchema = TopicSchema.pick({
  name: true,
  description: true,
  chapterId: true,
});

export type Topic = z.infer<typeof TopicSchema>;
export type CreateTopicInput = z.infer<typeof CreateTopicInputSchema>;
