import { createOpenAI } from "@ai-sdk/openai";
import {
  type Chapter,
  type Course,
  type Topic,
  type TopicAssessmentInputChunk,
  type TopicAssessmentResult,
  TopicAssessmentResultSchema,
} from "@hydrowise/entities";
import { generateText, Output } from "ai";
import { topicAssessmentPrompt } from "../../config";

const getOpenAIClient = () =>
  createOpenAI({
    baseURL: import.meta.env.VITE_DESKTOP_GEN_ENDPOINT,
    apiKey: "null",
  });

export const sendDesktopTopicIdea = async (
  chunks: TopicAssessmentInputChunk[],
  course: Course | null,
  chapter: Chapter | null,
  documentName: string,
  existingTopics: Pick<Topic, "name" | "description">[] = [],
): Promise<TopicAssessmentResult> => {
  const openai = getOpenAIClient();

  const payload = {
    existingTopics,
    chunks,
  };

  const result = await generateText({
    system: topicAssessmentPrompt(course, chapter, documentName),
    model: openai.chat("any"),
    prompt: JSON.stringify(payload),
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "topic-idea",
      description: "topic assignment and creation for chunk ideas",
      schema: TopicAssessmentResultSchema,
    }),
  });

  const output = (result as { output?: unknown }).output;
  return TopicAssessmentResultSchema.parse(output);
};
