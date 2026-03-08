import { getLanguageModel, initLanguageModel } from "./language";

export { getLanguageModel, initLanguageModel };
export { resolveAiRuntime } from "./runtime";

export const initAiRuntime = initLanguageModel;
export const initWebAiRuntime = initLanguageModel;
export const getDefaultHydroWiseModel = getLanguageModel;
