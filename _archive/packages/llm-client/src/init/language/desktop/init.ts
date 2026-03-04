import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export const initDesktopLanguageModel = async (
  onProgress?: (progress: number) => void,
) => {
  const endpoint = import.meta.env.VITE_DESKTOP_GEN_ENDPOINT;

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

export const getDesktopLanguageModel = (): LanguageModel => {
  const openai = createOpenAI({
    baseURL: import.meta.env.VITE_DESKTOP_GEN_ENDPOINT,
    apiKey: "null",
  });
  return openai.chat("any");
};
