import { Channel } from "@tauri-apps/api/core";
import { getEmbeddingModelDefinition } from "@/config/queries";
import type { DownloadProgress } from "@/managers/types";
import {
  listDesktopLanguageModels,
  loadDesktopLanguageModel,
} from "./api/models";
import {
  downloadLanguageModelFile,
  restartLanguageModelServer,
} from "./host/commands";
import { waitForDesktopServerReady } from "./readiness";

type DownloadDesktopEmbeddingModelOptions = {
  onProgress?: (progress: DownloadProgress) => void;
};

// Downloads the embedding model via Tauri, restarts the server, and waits until ready.
export const downloadDesktopEmbeddingModel = async (
  options: DownloadDesktopEmbeddingModelOptions,
): Promise<void> => {
  const { desktop } = getEmbeddingModelDefinition();

  const progress = new Channel<DownloadProgress>();
  progress.onmessage = (payload) => {
    options.onProgress?.(payload);
  };

  await downloadLanguageModelFile({
    progress,
    tier: "embedding",
    url: desktop.hfModelUrl,
  });

  // hfMmprojUrl is null for embedding — no projection file to download.

  await restartLanguageModelServer();
  await waitForDesktopServerReady();
  await warmDesktopEmbeddingModel();
};

// Waits for server readiness and loads the embedding model; returns its id.
export const warmDesktopEmbeddingModel = async (): Promise<string> => {
  await waitForDesktopServerReady();

  const models = await listDesktopLanguageModels();
  const modelId = models.find((m) => m.id === "embedding")?.id;

  if (!modelId) {
    throw new Error("Desktop embedding model is not available.");
  }

  await loadDesktopLanguageModel(modelId);

  return modelId;
};

// Returns true if the embedding model is present in the desktop server's model list.
export const isDesktopEmbeddingModelCached = async (): Promise<boolean> => {
  const models = await listDesktopLanguageModels();
  return models.some((m) => m.id === "embedding");
};
