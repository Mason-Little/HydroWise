import type { LanguageModel } from "ai";
import {
  getDesktopLanguageModel,
  initDesktopLanguageModel,
} from "./desktop/init";

type ModelState = {
  activeModel?: LanguageModel;
};

const modelState: ModelState = {};

export const initLanguageModel = async (
  onProgress?: (progress: number) => void,
) => {
  const runtime = import.meta.env.VITE_RUNTIME ?? import.meta.env.VITE_APP_MODE;

  if (runtime === "desktop") {
    await initDesktopLanguageModel(onProgress);
    modelState.activeModel = getDesktopLanguageModel();
  } else {
    throw new Error("Web language model is coming soon.");
  }
};

export const getLanguageModel = async (): Promise<LanguageModel> => {
  if (!modelState.activeModel) {
    await initLanguageModel();
  }

  if (!modelState.activeModel) {
    throw new Error("Language Model Couldn't be initialized.");
  }

  return modelState.activeModel;
};
