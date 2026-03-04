import type { GenerateQuizInput, QuizQuestion } from "@hydrowise/entities";
import { QuizQuestionSchema } from "@hydrowise/entities";
import { generateText, Output } from "ai";
import { getLanguageModel } from "../../../init/language";
import { quizPrompt } from "./config";

export const generateQuizGeneration = async (
  quizChunk: GenerateQuizInput,
): Promise<QuizQuestion[]> => {
  const result = await generateText({
    system: quizPrompt(),
    model: await getLanguageModel(),
    prompt: JSON.stringify(quizChunk),
    output: Output.array({
      name: "quiz",
      description: "Array of quiz questions",
      element: QuizQuestionSchema,
    }),
  });

  const output = (result as { output?: unknown }).output;
  return QuizQuestionSchema.array().parse(output);
};
