import type { EmbeddingModelV3 } from "@ai-sdk/provider";
import type { FeatureExtractionPipeline } from "@huggingface/transformers";

// Implements EmbeddingModelV3 using a HuggingFace FeatureExtractionPipeline.
// Mean-pooled + normalized embeddings match the bge-small-en-v1.5 training objective.
export const createWebEmbeddingAdapter = (
  pipe: FeatureExtractionPipeline,
): EmbeddingModelV3 => ({
  specificationVersion: "v3",
  provider: "hydrowise",
  modelId: "web-embedding",
  maxEmbeddingsPerCall: undefined,
  supportsParallelCalls: false,
  doEmbed: async ({ values }) => {
    const output = await pipe(values, { pooling: "mean", normalize: true });
    return {
      embeddings: output.tolist() as number[][],
      warnings: [],
    };
  },
});
