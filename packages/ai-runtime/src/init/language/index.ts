import type { LanguageModelV3 } from "@ai-sdk/provider";
import { getAiRuntime } from "../runtime";
import { getDesktopLanguageModel, initDesktopLanguageModel } from "./desktop/init";
import { getWebLanguageModel, initWebLanguageModel } from "./web/init";

export function initLanguageModel(): LanguageModelV3 {
  switch (getAiRuntime()) {
    case "web":
      return initWebLanguageModel();
    case "desktop":
      return initDesktopLanguageModel();
  }
}

export function getLanguageModel(): LanguageModelV3 {
  switch (getAiRuntime()) {
    case "web":
      return getWebLanguageModel();
    case "desktop":
      return getDesktopLanguageModel();
  }
}
