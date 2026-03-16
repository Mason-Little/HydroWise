import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { EmbeddingModelV3 } from "@ai-sdk/provider";
import { DESKTOP_EMBEDDING_PROVIDER_BASE_URL } from "@/backends/desktop/constants";

const DESKTOP_EMBEDDING_PROVIDER_NAME = "hydrowise-desktop-embeddings";

export const createDesktopEmbeddingModelAdapter = (
  modelId: string,
): EmbeddingModelV3 => {
  const provider = createOpenAICompatible({
    baseURL: DESKTOP_EMBEDDING_PROVIDER_BASE_URL,
    name: DESKTOP_EMBEDDING_PROVIDER_NAME,
  });

  return provider.embeddingModel(modelId);
};
