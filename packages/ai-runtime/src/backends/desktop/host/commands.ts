import type { Channel } from "@tauri-apps/api/core";
import { invoke } from "@tauri-apps/api/core";
import type { DownloadProgress } from "@/managers/language/manager";

// Invokes Tauri to stop the language-model server.
export const stopLanguageModelServer = async (): Promise<void> => {
  await invoke("stop_language_model_server_command");
};

// Invokes Tauri to restart the language-model server.
export const restartLanguageModelServer = async (): Promise<void> => {
  await invoke("restart_language_model_server_command");
};

// Invokes Tauri to download a model file, reporting progress on the channel.
export const downloadLanguageModelFile = async ({
  progress,
  tier,
  url,
}: {
  progress: Channel<DownloadProgress>;
  tier: string;
  url: string;
}): Promise<void> => {
  await invoke("download_language_model", {
    progress,
    tier,
    url,
  });
};

// Invokes Tauri to download a vision projection (mmproj) file, reporting progress on the channel.
export const downloadLanguageModelMmprojFile = async ({
  progress,
  tier,
  url,
}: {
  progress: Channel<DownloadProgress>;
  tier: string;
  url: string;
}): Promise<void> => {
  await invoke("download_language_model_mmproj", {
    progress,
    tier,
    url,
  });
};
