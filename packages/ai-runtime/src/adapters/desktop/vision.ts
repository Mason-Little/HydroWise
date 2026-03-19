import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModelV3 } from "@ai-sdk/provider";
import {
  DESKTOP_PROVIDER_BASE_URL,
  DESKTOP_PROVIDER_NAME,
} from "@/backends/desktop/constants";

// Returns an AI SDK language model (vision-capable) that calls the local desktop server.
// Identical pattern to createDesktopLanguageModelAdapter — the OCR model is a multimodal LLM.
export const createDesktopVisionAdapter = (
  modelId: string,
): LanguageModelV3 => {
  const provider = createOpenAICompatible({
    baseURL: DESKTOP_PROVIDER_BASE_URL,
    name: DESKTOP_PROVIDER_NAME,
  });

  return provider(modelId);
};
