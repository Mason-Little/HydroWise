import {
  type Chapter,
  type Topic,
  type TopicAssessmentResult,
  TopicAssessmentResultSchema,
} from "@hydrowise/entities";
import { generateText, Output } from "ai";
import { getLanguageModel } from "../../../init/language";
import { documentAssignmentPrompt } from "./config";

export const sendDocumentAssignment = async (
  chunkConcepts: string[],
  existingTopics: Topic[] = [],
  existingChapters: Chapter[] = [],
): Promise<TopicAssessmentResult> => {
  const payload = {
    existingTopics,
    existingChapters,
    chunks: chunkConcepts,
  };

  const result = await generateText({
    system: documentAssignmentPrompt(),
    model: await getLanguageModel(),
    prompt: JSON.stringify(payload),
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "document-assignment",
      description: "topic assignment and creation for chunk ideas",
      schema: TopicAssessmentResultSchema,
    }),
  });

  const output = (result as { output?: unknown }).output;
  return TopicAssessmentResultSchema.parse(output);
};
