import { z } from "zod";
import {
  QuizSkeletonTopicQuestionsSchema,
  QuizSkeletonTopicSchema,
} from "./quiz-skeleton.schema";

export const QuizSkeletonInputTopicSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export type QuizSkeletonInputTopic = z.infer<
  typeof QuizSkeletonInputTopicSchema
>;

export const QuizSkeletonInputItemSchema = z.object({
  selectedCourse: z.string().min(1),
  selectedChapter: z.string().min(1),
  topics: z.array(QuizSkeletonInputTopicSchema),
});

export type QuizSkeletonInputItem = z.infer<typeof QuizSkeletonInputItemSchema>;

export const QuizSkeletonInputSchema = z.array(QuizSkeletonInputItemSchema);

export type QuizSkeletonInput = z.infer<typeof QuizSkeletonInputSchema>;

export const GenerateQuizInputSchema = QuizSkeletonTopicSchema.extend({
  questions: QuizSkeletonTopicQuestionsSchema,
  topicChunks: z.array(z.string()).optional(),
});

export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;
