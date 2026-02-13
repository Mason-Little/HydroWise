import { createOpenAI } from "@ai-sdk/openai";
import {
  type Chapter,
  type ChunkIdeaResult,
  ChunkIdeaResultSchema,
  type Course,
  type EmbeddingChunk,
} from "@hydrowise/entities";
import { generateText, Output } from "ai";
import { chunkIdeaPrompt } from "../../config";

const getOpenAIClient = () =>
  createOpenAI({
    baseURL: import.meta.env.VITE_DESKTOP_GEN_ENDPOINT,
    apiKey: "null",
  });

export const sendDesktopChunkIdea = async (
  chunk: EmbeddingChunk,
  documentName: string,
  course: Course | null,
  chapter: Chapter | null,
): Promise<ChunkIdeaResult> => {
  const openai = getOpenAIClient();
  const result = await generateText({
    system: chunkIdeaPrompt(course, chapter, documentName),
    model: openai.chat("any"),
    prompt: chunk.content,
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "chunk-idea",
      description: "dominant idea for a document chunk",
      schema: ChunkIdeaResultSchema,
    }),
  });

  const output = (result as { output?: unknown }).output;
  return ChunkIdeaResultSchema.parse(output);
};
