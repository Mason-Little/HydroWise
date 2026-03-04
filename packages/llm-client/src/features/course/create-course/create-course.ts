import {
  type CreateCourseResult,
  CreateCourseResultSchema,
} from "@hydrowise/entities";
import { generateText, Output } from "ai";
import { getLanguageModel } from "../../../init/language";
import { createCoursePrompt } from "./config";

export const sendCreateCourse = async (
  syllabus: string,
): Promise<CreateCourseResult> => {
  const result = await generateText({
    system: createCoursePrompt(),
    model: await getLanguageModel(),
    prompt: JSON.stringify({
      syllabus,
    }),
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "create-course",
      description: "structured course data extracted from a syllabus",
      schema: CreateCourseResultSchema,
    }),
  });

  const output = (result as { output?: unknown }).output;
  return CreateCourseResultSchema.parse(output);
};
