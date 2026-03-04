import { createOpenAI } from "@ai-sdk/openai";
import type { EmbeddingModel } from "ai";

export const initDesktopEmbeddingModel = async (
  onProgress?: (progress: number) => void,
) => {
  const endpoint = import.meta.env.VITE_DESKTOP_EMBEDDING_ENDPOINT;

  if (!endpoint) {
    throw new Error("VITE_DESKTOP_GEN_ENDPOINT is not defined");
  }

  const response = await fetch(`${endpoint}/health`);
  const health = await response.json();
  if (health.status === "ok") {
    onProgress?.(100);
  } else {
    throw new Error("Desktop LLM client is not healthy");
  }
};

export const getDesktopEmbeddingModel = (): EmbeddingModel => {
  const openai = createOpenAI({
    baseURL: import.meta.env.VITE_DESKTOP_EMBEDDING_ENDPOINT,
    apiKey: "null",
  });
  return openai.embedding("any");
};
