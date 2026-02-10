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

export type Quiz = z.infer<typeof QuizSchema>;

export const GetQuizzesResponseSchema = z.array(QuizSchema);

export type GetQuizzesResponse = z.infer<typeof GetQuizzesResponseSchema>;

export const CreateQuizResponseSchema = QuizSchema;

export type CreateQuizResponse = z.infer<typeof CreateQuizResponseSchema>;
