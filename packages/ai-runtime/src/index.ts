export {
  getDesktopLanguageModel,
  initDesktopModelManager,
} from "@/managers/desktop";
export { getWebLanguageModel, initWebModelManager } from "@/managers/web";
export * from "./config";
export type {
  ChatRunInput,
  ChatRunResult,
  ChatRunStreamResult,
} from "./features/chat";
export { runChat, runChatStream } from "./features/chat";
export type { AiRuntime } from "./runtime";
export { getLanguageModel, initAiRuntime } from "./runtime";
