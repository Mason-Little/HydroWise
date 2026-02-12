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

export const CreateTopicRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  courseId: z.string(),
  chapterId: z.string().optional(),
});

export type CreateTopicRequest = z.infer<typeof CreateTopicRequestSchema>;

export const RetrieveTopicsRequestSchema = z.object({
  courseId: z.string(),
  chapterId: z.string().optional(),
});

export type RetrieveTopicsRequest = z.infer<typeof RetrieveTopicsRequestSchema>;

export const RetrieveTopicsResponseSchema = z.array(TopicSchema);

export type RetrieveTopicsResponse = z.infer<
  typeof RetrieveTopicsResponseSchema
>;
