import {
  type Course,
  type SyllabusRoutingResult,
  SyllabusRoutingResultSchema,
} from "@hydrowise/entities";
import { generateText, Output } from "ai";
import { getLanguageModel } from "../../../init/language";
import { syllabusRoutingPrompt } from "./config";

export const sendSyllabusRouting = async (
  chunkConcepts: string[],
  activeCourses: Pick<Course, "id" | "name" | "number">[],
): Promise<SyllabusRoutingResult> => {
  const payload = {
    chunkConcepts,
    activeCourses,
  };

  const result = await generateText({
    system: syllabusRoutingPrompt(),
    model: await getLanguageModel(),
    prompt: JSON.stringify(payload),
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "syllabus-routing",
      description: "classify syllabus vs course routing",
      schema: SyllabusRoutingResultSchema,
    }),
  });

  const output = (result as { output?: unknown }).output;
  return SyllabusRoutingResultSchema.parse(output);
};
