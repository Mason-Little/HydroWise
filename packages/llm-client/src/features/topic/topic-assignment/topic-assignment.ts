import {
  type Topic,
  type TopicAssessmentResult,
  TopicAssessmentResultSchema,
} from "@hydrowise/entities";
import { generateText, Output } from "ai";
import { getLanguageModel } from "../../../init/language";
import { topicAssessmentPrompt } from "./config";

export const sendTopicAssignment = async (
  chunkConcepts: string[],
  existingTopics: Pick<Topic, "name" | "description">[] = [],
): Promise<TopicAssessmentResult> => {
  const payload = {
    existingTopics,
    chunks: chunkConcepts,
  };

  const result = await generateText({
    system: topicAssessmentPrompt(),
    model: await getLanguageModel(),
    prompt: JSON.stringify(payload),
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "topic-assignment",
      description: "topic assignment and creation for chunk ideas",
      schema: TopicAssessmentResultSchema,
    }),
  });

  const output = (result as { output?: unknown }).output;
  return TopicAssessmentResultSchema.parse(output);
};
