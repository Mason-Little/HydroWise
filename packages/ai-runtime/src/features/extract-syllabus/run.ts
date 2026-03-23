import {
  CreateChapterInputSchema,
  CreateCourseInputSchema,
} from "@hydrowise/entities";
import { Output, streamText } from "ai";
import { z } from "zod";
import { getLanguageModel } from "@/runtime";
import { extractSyllabusPrompt } from "./config";

export const extractSyllabus = async (input: string) => {
  const { output } = streamText({
    model: getLanguageModel(),
    system: extractSyllabusPrompt(),
    prompt: input,
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "extract-syllabus",
      description: "extract the syllabus from the input",
      schema: CreateCourseInputSchema.extend({
        chapters: z.array(CreateChapterInputSchema.omit({ courseId: true })),
      }),
    }),
  });
  return output;
};
