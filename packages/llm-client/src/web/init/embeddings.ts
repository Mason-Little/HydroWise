import {
  doesBrowserSupportTransformersJS,
  transformersJS,
} from "@browser-ai/transformers-js";
import { type EmbeddingModel, embedMany } from "ai";

const model = transformersJS.embedding("Xenova/bge-base-en-v1.5", {
  normalize: true,
  pooling: "mean",
});

export const initWebEmbeddings = async (
  onProgress?: (progress: number) => void,
) => {
  if (!doesBrowserSupportTransformersJS()) {
    throw new Error("Browser does not support Transformers.js");
  }

  // 🔥 FORCE LOAD + COMPILE + CACHE
  await embedMany({
    model,
    values: ["warmup"],
  });

  onProgress?.(100);
};

export const getEmbeddingsModel = (): EmbeddingModel => {
  return model;
};
