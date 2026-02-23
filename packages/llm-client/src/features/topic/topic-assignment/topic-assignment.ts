import {
  type Chapter,
  type Course,
  type Topic,
  type TopicAssessmentInputChunk,
  type TopicAssessmentResult,
  TopicAssessmentResultSchema,
} from "@hydrowise/entities";
import { generateText, Output } from "ai";
import { getLanguageModel } from "../../../init/language";
import { topicAssessmentPrompt } from "./config";

export const sendTopicAssignment = async (
  chunks: TopicAssessmentInputChunk[],
  course: Course | null,
  chapter: Chapter | null,
  documentName: string,
  existingTopics: Pick<Topic, "name" | "description">[] = [],
): Promise<TopicAssessmentResult> => {
  const payload = {
    existingTopics,
    chunks,
  };

  const result = await generateText({
    system: topicAssessmentPrompt(course, chapter, documentName),
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
