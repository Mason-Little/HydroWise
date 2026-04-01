import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { EmbeddingModelV3 } from "@ai-sdk/provider";
import {
  DESKTOP_PROVIDER_BASE_URL,
  DESKTOP_PROVIDER_NAME,
} from "@/backends/desktop/constants";

// Returns an AI SDK embedding model that calls the local desktop server.
// Mirrors createDesktopLanguageModelAdapter — same provider, different factory method.
export const createDesktopEmbeddingAdapter = (
  modelId: string,
): EmbeddingModelV3 => {
  const provider = createOpenAICompatible({
    baseURL: DESKTOP_PROVIDER_BASE_URL,
    name: DESKTOP_PROVIDER_NAME,
  });

  return provider.embeddingModel(modelId);
};
