import {
  type Chapter,
  type ChunkConceptResult,
  ChunkConceptResultSchema,
  type Course,
  type EmbeddingChunk,
} from "@hydrowise/entities";
import { generateText, Output } from "ai";
import { getLanguageModel } from "../../../init/language";
import { chunkConceptPrompt } from "./config";

export const sendChunkConcept = async (
  chunk: EmbeddingChunk,
  documentName: string,
  course: Course | null,
  chapter: Chapter | null,
): Promise<ChunkConceptResult> => {
  const result = await generateText({
    system: chunkConceptPrompt(course, chapter, documentName),
    model: await getLanguageModel(),
    prompt: chunk.content,
    temperature: 0,
    topP: 1,
    output: Output.object({
      name: "chunk-concept",
      description: "dominant idea for a document chunk",
      schema: ChunkConceptResultSchema,
    }),
  });

  const output = (result as { output?: unknown }).output;
  return ChunkConceptResultSchema.parse(output);
};
