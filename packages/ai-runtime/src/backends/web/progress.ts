import type { ProgressInfo } from "@huggingface/transformers";
import type { DownloadProgress } from "@/managers/types";

// Maps a HuggingFace ProgressInfo event to our DownloadProgress shape.
function toDownloadProgress(info: ProgressInfo): DownloadProgress | null {
  if (
    (info.status === "progress" || info.status === "progress_total") &&
    "loaded" in info &&
    "total" in info
  ) {
    return {
      bytesDownloaded: info.loaded,
      bytesTotal: info.total,
      progress: info.progress / 100,
    };
  }
  return null;
}

// Returns a HuggingFace progress_callback that forwards events to onProgress.
export const makeWebProgressCallback = (
  onProgress?: (progress: DownloadProgress) => void,
) => {
  return (
    onProgress &&
    ((info: ProgressInfo) => {
      const progress = toDownloadProgress(info);
      if (progress) onProgress(progress);
    })
  );
};
