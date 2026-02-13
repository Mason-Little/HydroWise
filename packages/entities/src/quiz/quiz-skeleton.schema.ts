import { z } from "zod";

export const QuizSkeletonTopicQuestionsSchema = z.object({
  bool: z.number().int().nonnegative(),
  mcq: z.number().int().nonnegative(),
  short: z.number().int().nonnegative(),
});

export type QuizSkeletonTopicQuestions = z.infer<
  typeof QuizSkeletonTopicQuestionsSchema
>;

export const QuizSkeletonTopicSchema = z.object({
  name: z.string().min(1),
  chunkCount: z.number().int().nonnegative(),
  questions: QuizSkeletonTopicQuestionsSchema,
});

export type QuizSkeletonTopic = z.infer<typeof QuizSkeletonTopicSchema>;

export const QuizSkeletonSchema = z.object({
  courseName: z.string().min(1),
  scope: z.enum(["chapter", "course"]),
  totalQuestions: z.number().int().nonnegative(),
  topics: z.array(QuizSkeletonTopicSchema),
});

export type QuizSkeleton = z.infer<typeof QuizSkeletonSchema>;
