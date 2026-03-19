import { Channel } from "@tauri-apps/api/core";
import { getVisionModelDefinition } from "@/config/queries";
import type { DownloadProgress } from "@/managers/types";
import {
  coolDesktopLanguageModel,
  listDesktopLanguageModels,
  loadDesktopLanguageModel,
} from "./api/models";
import {
  downloadLanguageModelFile,
  downloadLanguageModelMmprojFile,
  restartLanguageModelServer,
} from "./host/commands";
import { waitForDesktopServerReady } from "./readiness";

type DownloadDesktopVisionModelOptions = {
  onProgress?: (progress: DownloadProgress) => void;
};

// Downloads the vision model + mmproj via Tauri, restarts the server, and waits until ready.
export const downloadDesktopVisionModel = async (
  options: DownloadDesktopVisionModelOptions,
): Promise<void> => {
  const { desktop } = getVisionModelDefinition();

  const progress = new Channel<DownloadProgress>();
  progress.onmessage = (payload) => {
    options.onProgress?.(payload);
  };

  await downloadLanguageModelFile({
    progress,
    tier: "vision",
    url: desktop.hfModelUrl,
  });

  if (desktop.hfMmprojUrl) {
    await downloadLanguageModelMmprojFile({
      progress,
      tier: "vision",
      url: desktop.hfMmprojUrl,
    });
  }

  await restartLanguageModelServer();
  await waitForDesktopServerReady();
  await warmDesktopVisionModel();
};

// Waits for server readiness and loads the vision model; returns its id.
export const warmDesktopVisionModel = async (): Promise<string> => {
  await waitForDesktopServerReady();

  const models = await listDesktopLanguageModels();
  const modelId = models.find((m) => m.id === "vision")?.id;

  if (!modelId) {
    throw new Error("Desktop vision model is not available.");
  }

  await loadDesktopLanguageModel(modelId);

  return modelId;
};

// Unloads the vision model from the desktop server.
export const coolDesktopVisionModel = async (): Promise<void> => {
  await waitForDesktopServerReady();

  const models = await listDesktopLanguageModels();
  const modelId = models.find((m) => m.id === "vision")?.id;

  if (!modelId) {
    throw new Error("Desktop vision model is not available.");
  }

  await coolDesktopLanguageModel(modelId);
};

// Returns true if the vision model is present in the desktop server's model list.
export const isDesktopVisionModelCached = async (): Promise<boolean> => {
  const models = await listDesktopLanguageModels();
  return models.some((m) => m.id === "vision");
};
