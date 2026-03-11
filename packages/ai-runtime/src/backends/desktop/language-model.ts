import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const DEFAULT_BASE_URL = "http://127.0.0.1:39281/v1";
const DEFAULT_MODEL_ALIAS = "chat";

export const getDesktopLanguageModel = (baseUrl = DEFAULT_BASE_URL) => {
  const provider = createOpenAICompatible({
    name: "hydrowise-desktop",
    baseURL: baseUrl,
  });

  return provider(DEFAULT_MODEL_ALIAS);
};
