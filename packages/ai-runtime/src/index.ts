export {
  getDesktopLanguageModel,
  initDesktopModelManager,
} from "@/managers/language/desktop";
export {
  getWebLanguageModel,
  initWebModelManager,
} from "@/managers/language/web";
export * from "./config";
export { sendGroundedChat } from "./features/chat";
export type { DownloadProgress } from "./managers/language/manager";
export type { AiRuntime } from "./runtime";
export {
  getLanguageModel,
  getLanguageModelManager,
  getRuntime,
  initAiRuntime,
} from "./runtime";
