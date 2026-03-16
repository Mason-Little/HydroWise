import { embed, embedMany } from "ai";
import { getEmbeddingModel } from "@/runtime";

export type EmbeddedText = readonly [embedding: number[], text: string];

export const embedString = async (text: string): Promise<number[]> => {
  const result = await embed({
    model: getEmbeddingModel(),
    value: text,
  });

  return result.embedding;
};

export const embedChunks = async (texts: string[]): Promise<EmbeddedText[]> => {
  if (texts.length === 0) {
    return [];
  }

  const result = await embedMany({
    model: getEmbeddingModel(),
    values: texts,
  });

  return texts.map(
    (text, index) => [result.embeddings[index] ?? [], text] as const,
  );
};
