import type { LanguageModelV3 } from "@ai-sdk/provider";
import { getDesktopLanguageModel } from "./backends/desktop/language-model";
import { getWebLanguageModel } from "./backends/web/language-model";

export type AiRuntime = "web" | "desktop";

const runtimeState: {
  currentRuntime: AiRuntime;
} = {
  currentRuntime: "web",
};

export const initAiRuntime = (runtime: AiRuntime): void => {
  runtimeState.currentRuntime = runtime;
};

export const getLanguageModel = (): LanguageModelV3 => {
  switch (runtimeState.currentRuntime) {
    case "desktop":
      return getDesktopLanguageModel();
    case "web":
      return getWebLanguageModel();
  }
};
