import type { LanguageModel } from "ai";
import { getDesktopVisionModel, initDesktopVisionModel } from "./desktop/init";

type ModelState = {
  activeModel?: LanguageModel;
};

const modelState: ModelState = {};

export const initVisionModel = async (
  onProgress?: (progress: number) => void,
) => {
  const runtime = import.meta.env.VITE_RUNTIME ?? import.meta.env.VITE_APP_MODE;

  if (runtime === "desktop") {
    await initDesktopVisionModel(onProgress);
    modelState.activeModel = getDesktopVisionModel();
  } else {
    throw new Error("Web vision model is coming soon.");
  }
};

export const getVisionModel = async (): Promise<LanguageModel> => {
  if (!modelState.activeModel) {
    await initVisionModel();
  }

  if (!modelState.activeModel) {
    throw new Error("Vision Model Couldn't be initialized.");
  }

  return modelState.activeModel;
};
