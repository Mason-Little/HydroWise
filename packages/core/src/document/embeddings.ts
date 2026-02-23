import type { EmbeddingChunk } from "@hydrowise/entities";
import { generateEmbeddings } from "@hydrowise/llm-client";

export const sendEmbeddings = async (
  chunks: string[],
  onProgress?: (completed: number, total: number) => void,
): Promise<EmbeddingChunk[]> => {
  if (chunks.length === 0) {
    return [];
  }

  const embeddings = await generateEmbeddings(chunks);
  onProgress?.(chunks.length, chunks.length);

  return chunks.map((content, index) => ({
    content,
    embedding: embeddings[index] ?? [],
    chunkIndex: index,
  }));
};
