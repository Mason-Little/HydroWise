import { createOpenAI } from "@ai-sdk/openai";
import {
  type QuizSkeleton,
  type QuizSkeletonInput,
  QuizSkeletonInputSchema,
  QuizSkeletonSchema,
} from "@hydrowise/entities";
import { generateText, Output } from "ai";
import { quizSkeletonPrompt } from "../../config";

const getOpenAIClient = () =>
  createOpenAI({
    baseURL: import.meta.env.VITE_DESKTOP_GEN_ENDPOINT,
    apiKey: "null",
  });

export const sendDesktopQuizSkeleton = async (
  items: QuizSkeletonInput,
): Promise<QuizSkeleton> => {
  const openai = getOpenAIClient();
  const payload = QuizSkeletonInputSchema.parse(items);

  const result = await generateText({
    system: quizSkeletonPrompt(),
    model: openai.chat("any"),
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
