import { Channel } from "@tauri-apps/api/core";
import { getVisionModelDefinition } from "@/config/queries";
import type { DownloadProgress } from "@/managers/types";
import {
  coolDesktopServerModel,
  listDesktopServerModels,
  loadDesktopServerModel,
} from "./api/models";
import {
  downloadDesktopModelFile,
  downloadDesktopMmprojFile,
  restartDesktopModelServer,
} from "./host/commands";

type DownloadDesktopVisionModelOptions = {
  onProgress?: (progress: DownloadProgress) => void;
};

// Downloads the vision model + mmproj via Tauri, restarts the server, and warms the model.
export const downloadDesktopVisionModel = async (
  options: DownloadDesktopVisionModelOptions,
): Promise<void> => {
  const { desktop } = getVisionModelDefinition();

  const progress = new Channel<DownloadProgress>();
  progress.onmessage = (payload) => {
    options.onProgress?.(payload);
  };

  await downloadDesktopModelFile({
    progress,
    tier: "vision",
    url: desktop.hfModelUrl,
  });

  if (desktop.hfMmprojUrl) {
    await downloadDesktopMmprojFile({
      progress,
      tier: "vision",
      url: desktop.hfMmprojUrl,
    });
  }

  await restartDesktopModelServer();
  await warmDesktopVisionModel();
};

// Loads the vision model on the desktop server; returns its id.
export const warmDesktopVisionModel = async (): Promise<string> => {
  const models = await listDesktopServerModels();
  const modelId = models.find((m) => m.id === "vision")?.id;

  if (!modelId) {
    throw new Error("Desktop vision model is not available.");
  }

  await loadDesktopServerModel(modelId);

  return modelId;
};

// Unloads the vision model from the desktop server.
export const coolDesktopVisionModel = async (): Promise<void> => {
  const models = await listDesktopServerModels();
  const modelId = models.find((m) => m.id === "vision")?.id;

  if (!modelId) {
    throw new Error("Desktop vision model is not available.");
  }

  await coolDesktopServerModel(modelId);
};

// Returns true if the vision model is present in the desktop server's model list.
export const isDesktopVisionModelCached = async (): Promise<boolean> => {
  const models = await listDesktopServerModels();
  return models.some((m) => m.id === "vision");
};
