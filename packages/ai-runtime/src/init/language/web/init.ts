import type { LanguageModelV3 } from "@ai-sdk/provider";
import {
  getDefaultWebLanguageModel,
  initDefaultWebLanguageModel,
} from "./models";

export const initWebLanguageModel = (): LanguageModelV3 => {
  return initDefaultWebLanguageModel();
};

export const getWebLanguageModel = (): LanguageModelV3 => {
  return getDefaultWebLanguageModel();
};
