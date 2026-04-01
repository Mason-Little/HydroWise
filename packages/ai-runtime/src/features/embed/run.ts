import { embed, embedMany } from "ai";
import { getEmbeddingModel } from "@/runtime";

export const embedText = async (text: string): Promise<number[]> => {
  const model = getEmbeddingModel();
  const result = await embed({
    model,
    value: text,
  });
  return result.embedding;
};

export const embedTexts = async (texts: string[]): Promise<number[][]> => {
  const model = getEmbeddingModel();
  const result = await embedMany({
    model,
    values: texts,
  });
  return result.embeddings;
};
