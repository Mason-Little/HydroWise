import { type DocumentRoute, DocumentRouteSchema } from "@hydrowise/entities";
import { Output, streamText } from "ai";
import { getLanguageModel } from "@/runtime";
import { type CourseTree, documentRouterPrompt } from "./config";

export const documentRouter = async (
  abstractsText: string,
  courseTree: CourseTree,
): Promise<DocumentRoute> => {
  const model = getLanguageModel();

  const { output } = streamText({
    system: documentRouterPrompt(courseTree),
    model,
    prompt: abstractsText,
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "document-router",
      description: "document router",
      schema: DocumentRouteSchema,
    }),
  });

  return output;
};
