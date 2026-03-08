import type { LanguageModelV3 } from "@ai-sdk/provider";
import { createWebLanguageModel } from "../../../provider/language-model";

let defaultLanguageModel: LanguageModelV3 | null = null;

export function initDefaultWebLanguageModel(): LanguageModelV3 {
  const model = defaultLanguageModel ?? createWebLanguageModel();
  defaultLanguageModel = model;
  return model;
}

export function getDefaultWebLanguageModel(): LanguageModelV3 {
  return initDefaultWebLanguageModel();
}
