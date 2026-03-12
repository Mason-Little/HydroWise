import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModelV3 } from "@ai-sdk/provider";
import { DESKTOP_PROVIDER_BASE_URL } from "@/backends/desktop/constants";

const DESKTOP_PROVIDER_NAME = "hydrowise-desktop";

// Returns an AI SDK language model that calls the local desktop server.
export const createDesktopLanguageModelAdapter = (
  modelId: string,
): LanguageModelV3 => {
  const provider = createOpenAICompatible({
    baseURL: DESKTOP_PROVIDER_BASE_URL,
    name: DESKTOP_PROVIDER_NAME,
  });

  return provider(modelId);
};
