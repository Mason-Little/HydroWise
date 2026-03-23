import { Output, streamText } from "ai";
import z from "zod";
import { getLanguageModel } from "@/runtime";
import { classifyDocumentPrompt } from "./config";

export const classify = async (input: string) => {
  const { output } = streamText({
    model: getLanguageModel(),
    system: classifyDocumentPrompt(),
    prompt: input,
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "classify",
      description: "classify the input",
      schema: z.object({
        classification: z.enum(["syllabus", "course", "other"]),
      }),
    }),
  });

  console.log(output);
  return output;
};
