import type { CreateEmbeddingRequest } from "@hydrowise/entities";
import { useMutation } from "@tanstack/react-query";
import { embeddingAPI } from "@/api/embedding/embedding";

export const useEmbeddingQueries = () => {
  const {
    mutateAsync: contextRetrieval,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["context-retrieval"],
    mutationFn: (embedding: number[]) =>
      embeddingAPI.getContextRetrieval({ embedding }),
  });

  const {
    mutateAsync: createEmbeddingChunk,
    isPending: createEmbeddingChunkPending,
    error: createEmbeddingChunkError,
  } = useMutation({
    mutationKey: ["create-embedding-chunk"],
    mutationFn: (embeddingChunk: CreateEmbeddingRequest) =>
      embeddingAPI.createEmbeddingChunk(embeddingChunk),
  });
  return {
    contextRetrieval,
    isPending,
    error,
    createEmbeddingChunk,
    createEmbeddingChunkPending,
    createEmbeddingChunkError,
  };
};
