import type { LanguageModelV3 } from "@ai-sdk/provider";
import { resolveAiRuntime } from "../runtime";
import { getWebLanguageModel, initWebLanguageModel } from "./web/init";

function getRuntimeLanguageModelApi(): {
  initLanguageModel: () => LanguageModelV3;
  getLanguageModel: () => LanguageModelV3;
} {
  switch (resolveAiRuntime()) {
    case "web":
      return {
        initLanguageModel: initWebLanguageModel,
        getLanguageModel: getWebLanguageModel,
      };
    case "desktop":
      throw new Error("Desktop language model not implemented yet");
  }
}

export function initLanguageModel(): LanguageModelV3 {
  return getRuntimeLanguageModelApi().initLanguageModel();
}

export function getLanguageModel(): LanguageModelV3 {
  return getRuntimeLanguageModelApi().getLanguageModel();
}
