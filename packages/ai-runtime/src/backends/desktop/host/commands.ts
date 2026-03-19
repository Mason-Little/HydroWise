import type { Channel } from "@tauri-apps/api/core";
import { invoke } from "@tauri-apps/api/core";
import type { DownloadProgress } from "@/managers/types";

// Invokes Tauri to stop the desktop model (llama) server.
export const stopDesktopModelServer = async (): Promise<void> => {
  await invoke("stop_desktop_model_server_command");
};

// Invokes Tauri to restart the desktop model server.
export const restartDesktopModelServer = async (): Promise<void> => {
  await invoke("restart_desktop_model_server_command");
};

// Invokes Tauri to download a GGUF into a model slot, reporting progress on the channel.
export const downloadDesktopModelFile = async ({
  progress,
  tier,
  url,
}: {
  progress: Channel<DownloadProgress>;
  tier: string;
  url: string;
}): Promise<void> => {
  await invoke("download_desktop_model", {
    progress,
    tier,
    url,
  });
};

// Invokes Tauri to download a vision projection (mmproj) file, reporting progress on the channel.
export const downloadDesktopMmprojFile = async ({
  progress,
  tier,
  url,
}: {
  progress: Channel<DownloadProgress>;
  tier: string;
  url: string;
}): Promise<void> => {
  await invoke("download_desktop_model_mmproj", {
    progress,
    tier,
    url,
  });
};
