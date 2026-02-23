import type { LanguageModel } from "ai";
import {
  getDesktopLanguageModel,
  initDesktopLanguageModel,
} from "./desktop/init";

type ModelState = {
  activeModel?: LanguageModel;
};

const modelState: ModelState = {};

export const initLanguage = async (onProgress?: (progress: number) => void) => {
  if (import.meta.env.VITE_APP_MODE === "desktop") {
    await initDesktopLanguageModel(onProgress);
    modelState.activeModel = getDesktopLanguageModel();
  } else {
    throw new Error("Web language model is coming soon.");
  }
};

export const getLanguageModel = (): LanguageModel => {
  if (!modelState.activeModel) {
    throw new Error(
      "Language model has not been initialized. Call initLanguage first.",
    );
  }
  return modelState.activeModel;
};
