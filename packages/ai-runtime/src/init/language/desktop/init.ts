import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModelV3 } from "@ai-sdk/provider";

const DEFAULT_BASE_URL = "http://127.0.0.1:39281/v1";
/** Must match the llama-router model alias/preset exposed by the desktop sidecar. */
const DEFAULT_DESKTOP_MODEL_ALIAS = "chat";

let cachedModel: LanguageModelV3 | null = null;
let cachedBaseUrl: string | null = null;

const getProvider = (baseUrl: string = DEFAULT_BASE_URL) => {
  return createOpenAICompatible({
    name: "hydrowise-desktop",
    baseURL: baseUrl,
  });
};

export const initDesktopLanguageModel = (options?: {
  baseUrl?: string;
}): LanguageModelV3 => {
  const baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;
  const provider = getProvider(baseUrl);
  const model = provider(DEFAULT_DESKTOP_MODEL_ALIAS) as LanguageModelV3;
  cachedModel = model;
  cachedBaseUrl = baseUrl;
  return model;
};

export const getDesktopLanguageModel = (options?: {
  baseUrl?: string;
}): LanguageModelV3 => {
  const baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;
  if (cachedModel !== null && cachedBaseUrl === baseUrl) {
    return cachedModel;
  }
  return initDesktopLanguageModel({ baseUrl });
};
