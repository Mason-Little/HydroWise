import type { AiRuntime } from "@/init/runtime";
import type { LanguageModelId } from "@/models/language-models";

export type LanguageModelDownloadState =
  | "not-downloaded"
  | "queued"
  | "downloading"
  | "downloaded"
  | "error";

export type LanguageModelLoadState =
  | "unavailable"
  | "idle"
  | "warming"
  | "ready"
  | "in-use"
  | "error";

export type LanguageModelRuntimeStatus = {
  runtime: AiRuntime;
  enabled: boolean;
  downloadState: LanguageModelDownloadState;
  loadState: LanguageModelLoadState;
  progress: number | null;
  bytesDownloaded: number | null;
  bytesTotal: number | null;
  downloadedAt: string | null;
  lastUsedAt: string | null;
  errorMessage: string | null;
};

export type LanguageModelStatus = {
  modelId: LanguageModelId;
  selected: boolean;
  runtimes: Record<AiRuntime, LanguageModelRuntimeStatus>;
};

export function createEmptyLanguageModelRuntimeStatus(
  runtime: AiRuntime,
  enabled: boolean,
): LanguageModelRuntimeStatus {
  return {
    runtime,
    enabled,
    downloadState: enabled ? "not-downloaded" : "not-downloaded",
    loadState: enabled ? "idle" : "unavailable",
    progress: null,
    bytesDownloaded: null,
    bytesTotal: null,
    downloadedAt: null,
    lastUsedAt: null,
    errorMessage: null,
  };
}

export function createEmptyLanguageModelStatus(
  modelId: LanguageModelId,
  options?: {
    selected?: boolean;
    webEnabled?: boolean;
    desktopEnabled?: boolean;
  },
): LanguageModelStatus {
  return {
    modelId,
    selected: options?.selected ?? false,
    runtimes: {
      web: createEmptyLanguageModelRuntimeStatus(
        "web",
        options?.webEnabled ?? true,
      ),
      desktop: createEmptyLanguageModelRuntimeStatus(
        "desktop",
        options?.desktopEnabled ?? true,
      ),
    },
  };
}
