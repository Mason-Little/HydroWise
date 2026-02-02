import { transformersJS } from "@browser-ai/transformers-js";
import { embedMany } from "ai";
import { EMBEDDING_CONFIG } from "../config";

export const getEmbeddings = async (values: string[]): Promise<number[][]> => {
  const result = await embedMany({
    model: transformersJS.embedding(EMBEDDING_CONFIG.model, {
      normalize: EMBEDDING_CONFIG.normalize,
      pooling: EMBEDDING_CONFIG.pooling,
    }),
    values,
  });

  return result.embeddings;
};
