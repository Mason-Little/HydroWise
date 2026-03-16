export {
  getDesktopEmbeddingModel,
  initDesktopEmbeddingManager,
} from "@/managers/desktop";
export { getWebEmbeddingModel, initWebEmbeddingManager } from "@/managers/web";
export { type EmbeddedText, embedChunks, embedString } from "./features/embed";
export type { EmbeddingsRuntime } from "./runtime";
export {
  getEmbeddingModel,
  getRuntime,
  initEmbeddingsRuntime,
} from "./runtime";
