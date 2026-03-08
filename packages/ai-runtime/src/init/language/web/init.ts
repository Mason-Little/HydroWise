import type { LanguageModelV3 } from "@ai-sdk/provider";
import {
  getDefaultWebLanguageModel,
  initDefaultWebLanguageModel,
} from "./models";

export function initWebLanguageModel(): LanguageModelV3 {
  return initDefaultWebLanguageModel();
}

export function getWebLanguageModel(): LanguageModelV3 {
  return getDefaultWebLanguageModel();
}
