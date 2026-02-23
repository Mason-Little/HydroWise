import {
  type QuizSkeleton,
  type QuizSkeletonInput,
  QuizSkeletonInputSchema,
  QuizSkeletonSchema,
} from "@hydrowise/entities";
import { generateText, Output } from "ai";
import { getLanguageModel } from "../../../init/language";
import { quizSkeletonPrompt } from "./config";

export const sendDesktopQuizSkeleton = async (
  items: QuizSkeletonInput,
): Promise<QuizSkeleton> => {
  const model = getLanguageModel();
  const payload = QuizSkeletonInputSchema.parse(items);

  const result = await generateText({
    system: quizSkeletonPrompt(),
    model,
    prompt: JSON.stringify(payload),
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "quiz-skeleton",
      description: "quiz skeleton grouped by topic",
      schema: QuizSkeletonSchema,
    }),
  });

  const output = (result as { output?: unknown }).output;
  return QuizSkeletonSchema.parse(output);
};
