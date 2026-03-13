import type { LanguageModelV3CallOptions } from "@ai-sdk/provider";

export const mapGenerateOptions = (options: LanguageModelV3CallOptions) => ({
  max_new_tokens: options.maxOutputTokens ?? 256,
  temperature: options.temperature ?? 0.7,
  top_p: options.topP ?? 0.8,
  top_k: options.topK ?? 20,
});
