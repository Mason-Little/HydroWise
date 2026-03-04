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
