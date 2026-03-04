import { z } from "zod";
import { QuizQuestionSchema } from "./question.schema";

export const QuizSchema = z.object({
  id: z.string().min(1),
  chatId: z.string().min(1),
  questions: z.array(QuizQuestionSchema),
});

export type Quiz = z.infer<typeof QuizSchema>;
