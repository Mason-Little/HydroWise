import { z } from "zod";
import { QuizSchema } from "./quiz.schema";

export const GetQuizzesResponseSchema = z.array(QuizSchema);

export type GetQuizzesResponse = z.infer<typeof GetQuizzesResponseSchema>;

export const CreateQuizResponseSchema = QuizSchema;

export type CreateQuizResponse = z.infer<typeof CreateQuizResponseSchema>;
