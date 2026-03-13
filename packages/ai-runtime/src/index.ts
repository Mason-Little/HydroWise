export {
  getDesktopLanguageModel,
  initDesktopModelManager,
} from "@/managers/desktop";
export { getWebLanguageModel, initWebModelManager } from "@/managers/web";
export * from "./config";
export { sendGroundedChat } from "./features/chat";
export type { DownloadProgress } from "./managers/manager";
export type { AiRuntime } from "./runtime";
export {
  getLanguageModel,
  getLanguageModelManager,
  getRuntime,
  initAiRuntime,
} from "./runtime";
