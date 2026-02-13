import { z } from "zod";

export const BoolQuestionSchema = z.object({
  type: z.literal("bool"),
  question: z.string(),
  answer: z.boolean(),
});

export type BoolQuestion = z.infer<typeof BoolQuestionSchema>;

export const MultipleChoiceQuestionSchema = z.object({
  type: z.literal("multipleChoice"),
  question: z.string(),
  options: z.array(z.string()),
  answer: z.number(),
});

export type MultipleChoiceQuestion = z.infer<
  typeof MultipleChoiceQuestionSchema
>;

export const ShortAnswerQuestionSchema = z.object({
  type: z.literal("shortAnswer"),
  question: z.string(),
  answer: z.string(),
});

export type ShortAnswerQuestion = z.infer<typeof ShortAnswerQuestionSchema>;

export const QuizQuestionSchema = z.discriminatedUnion("type", [
  BoolQuestionSchema,
  MultipleChoiceQuestionSchema,
  ShortAnswerQuestionSchema,
]);

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const QuizSchema = z.object({
  id: z.string().min(1),
  chatId: z.string().min(1),
  questions: z.array(QuizQuestionSchema),
});

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

export type Quiz = z.infer<typeof QuizSchema>;

export const GetQuizzesResponseSchema = z.array(QuizSchema);

export type GetQuizzesResponse = z.infer<typeof GetQuizzesResponseSchema>;

export const CreateQuizResponseSchema = QuizSchema;

export type CreateQuizResponse = z.infer<typeof CreateQuizResponseSchema>;

export const GenerateQuizInputSchema = QuizSkeletonTopicSchema.extend({
  questions: QuizSkeletonTopicQuestionsSchema,
  topicChunks: z.array(z.string()).optional(),
});

export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;
