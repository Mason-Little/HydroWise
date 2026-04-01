import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModelV3 } from "@ai-sdk/provider";
import {
  DESKTOP_PROVIDER_BASE_URL,
  DESKTOP_PROVIDER_NAME,
} from "@/backends/desktop/constants";

// Returns an AI SDK language model that calls the local desktop server.
export const createDesktopLanguageModelAdapter = (
  modelId: string,
): LanguageModelV3 => {
  const provider = createOpenAICompatible({
    baseURL: DESKTOP_PROVIDER_BASE_URL,
    name: DESKTOP_PROVIDER_NAME,
    supportsStructuredOutputs: true,
  });

  return provider(modelId);
};
