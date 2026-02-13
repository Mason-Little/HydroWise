/* 

ok so we are going to get every single embedding chunk for a given input array of all documents within course/chapter. we should create a
range amount of questions for each chunk. then ideally we recursively call a agent that is going to generate {x} amount of questions. this agent should take in 
previous questions and the current chunk of text and generate new questions based on that. we are going to also want to pass the json schemas for each type of question
Bool/Short Answer/Multiple Choice/Fill in the Blank

*/

import { createOpenAI } from "@ai-sdk/openai";
import type { GenerateQuizInput, QuizQuestion } from "@hydrowise/entities";
import { QuizQuestionSchema } from "@hydrowise/entities";
import { generateText, Output } from "ai";
import { quizPrompt } from "../../config";

const getOpenAIClient = () =>
  createOpenAI({
    baseURL: import.meta.env.VITE_DESKTOP_GEN_ENDPOINT,
    apiKey: "null",
  });

export const sendDesktopQuiz = async (
  quizChunk: GenerateQuizInput,
): Promise<QuizQuestion[]> => {
  const openai = getOpenAIClient();
  const result = await generateText({
    system: quizPrompt(),
    model: openai.chat("any"),
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
