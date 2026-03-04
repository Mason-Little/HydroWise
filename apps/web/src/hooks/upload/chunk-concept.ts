import { sendChunkConcept } from "@hydrowise/llm-client";

export const chunkConcepts = async (documentChunks: string[]) => {
  const chunkConcepts = await Promise.all(
    documentChunks.map((chunk) => sendChunkConcept(chunk)),
  );
  return chunkConcepts.map((chunkConcept) => chunkConcept.idea);
};
