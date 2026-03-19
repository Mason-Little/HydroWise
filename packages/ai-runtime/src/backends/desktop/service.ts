import { Channel } from "@tauri-apps/api/core";
import type { LanguageModelTier } from "@/config/definitions";
import { getLanguageModelDefinition } from "@/config/queries";
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
  const models = await listDesktopServerModels();

  return models.find((model) => model.id === tier)?.id;
};

// Downloads the tier's model via Tauri, restarts the server, and waits until ready.
export const downloadDesktopModel = async (
  options: DownloadDesktopModelOptions,
) => {
  const { desktop } = getLanguageModelDefinition(options.tier);

  if (!desktop?.hfModelUrl) {
    throw new Error(`Model ${options.tier} is not available on desktop.`);
  }

  const progress = new Channel<DownloadProgress>();
  progress.onmessage = (payload) => {
    options.onProgress?.(payload);
  };

  await downloadDesktopModelFile({
    progress,
    tier: options.tier,
    url: desktop.hfModelUrl,
  });

  if (desktop.hfMmprojUrl) {
    await downloadDesktopMmprojFile({
      progress,
      tier: options.tier,
      url: desktop.hfMmprojUrl,
    });
  }

  await restartDesktopModelServer();
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
    throw new Error(`Desktop model ${tier} is not available.`);
  }

  await loadDesktopServerModel(modelId);

  return modelId;
};

// Waits for server readiness and cools the tier's model; returns its id.
export const coolDesktopModel = async (
  tier: LanguageModelTier,
): Promise<string> => {
  await waitForDesktopServerReady();

  const modelId = await findDesktopModelId(tier);

  if (!modelId) {
    throw new Error(`Desktop model ${tier} is not available.`);
  }

  await coolDesktopServerModel(modelId);

  return modelId;
};

// Returns tiers for models currently available on the desktop server.
export const listCachedDesktopModels = async (): Promise<
  LanguageModelTier[]
> => {
  const models = await listDesktopServerModels();

  return models.map((model) => model.id as LanguageModelTier);
};
