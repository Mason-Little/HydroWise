import { Output, streamText } from "ai";
import { getLanguageModel } from "@/runtime";
import { pageAbstractsPrompt, pageAbstractsSchema } from "./config";

export const pageAbstracts = async (pages: string) => {
  const { output } = streamText({
    model: getLanguageModel(),
    system: pageAbstractsPrompt,
    prompt: pages,
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "page-abstracts",
      description: "page abstracts",
      schema: pageAbstractsSchema,
    }),
  });

  return output;
};
