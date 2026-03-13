import { Channel } from "@tauri-apps/api/core";
import type { LanguageModelTier } from "@/config/definitions";
import { getLanguageModelDefinition } from "@/config/queries";
import type { DownloadProgress } from "@/managers/manager";
import {
  listDesktopLanguageModels,
  loadDesktopLanguageModel,
} from "./api/models";
import {
  downloadLanguageModelFile,
  restartLanguageModelServer,
} from "./host/commands";
import { waitForDesktopServerReady } from "./readiness";

type DownloadDesktopModelOptions = {
  tier: LanguageModelTier;
  onProgress?: (progress: DownloadProgress) => void;
};

export const ensureDesktopServerReady = waitForDesktopServerReady;

// Returns the desktop server model id for the given tier, if present.
const findDesktopModelId = async (
  tier: LanguageModelTier,
): Promise<string | undefined> => {
  const models = await listDesktopLanguageModels();

  return models.find((model) => model.id === tier)?.id;
};

// Downloads the tier's model via Tauri, restarts the server, and waits until ready.
export const downloadDesktopModel = async (
  options: DownloadDesktopModelOptions,
) => {
  const definition = getLanguageModelDefinition(options.tier);

  if (!definition.hfModelUrl) {
    throw new Error(`Model ${options.tier} is not available on desktop.`);
  }

  const progress = new Channel<DownloadProgress>();
  progress.onmessage = (payload) => {
    options.onProgress?.(payload);
  };

  await downloadLanguageModelFile({
    progress,
    tier: options.tier,
    url: definition.hfModelUrl,
  });

  await restartLanguageModelServer();
  await waitForDesktopServerReady();
  await warmDesktopModel(options.tier);
};

// Waits for server readiness and loads the tier's model; returns its id.
export const warmDesktopModel = async (
  tier: LanguageModelTier,
): Promise<string> => {
  await waitForDesktopServerReady();

  const modelId = await findDesktopModelId(tier);

  if (!modelId) {
    throw new Error(`Desktop language model ${tier} is not available.`);
  }

  await loadDesktopLanguageModel(modelId);

  return modelId;
};

// Returns tiers for models currently available on the desktop server.
export const listCachedDesktopModels = async (): Promise<
  LanguageModelTier[]
> => {
  const models = await listDesktopLanguageModels();

  return models.map((model) => model.id as LanguageModelTier);
};
