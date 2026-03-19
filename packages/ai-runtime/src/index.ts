export {
  getDesktopEmbeddingModel,
  getWebEmbeddingModel,
  initDesktopEmbeddingManager,
  initWebEmbeddingManager,
} from "@/managers/embedding";
export type { EmbeddingModelManager } from "@/managers/embedding/manager";
export {
  getDesktopLanguageModel,
  initDesktopModelManager,
} from "@/managers/language/desktop";
export {
  getWebLanguageModel,
  initWebModelManager,
} from "@/managers/language/web";
export {
  getDesktopVisionModel,
  getWebVisionModel,
  initDesktopVisionManager,
  initWebVisionManager,
} from "@/managers/vision";
export type { VisionModelManager } from "@/managers/vision/manager";
export * from "./config";
export { sendGroundedChat } from "./features/chat";
export type { DownloadProgress } from "./managers/language/manager";
export type { AiRuntime } from "./runtime";
export {
  getEmbeddingModel,
  getEmbeddingModelManager,
  getLanguageModel,
  getLanguageModelManager,
  getRuntime,
  getVisionModel,
  getVisionModelManager,
  initAiRuntime,
} from "./runtime";
