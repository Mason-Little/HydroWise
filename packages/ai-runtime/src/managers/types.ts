export type DownloadProgress = {
  bytesDownloaded: number;
  bytesTotal: number;
  progress: number;
};

export type DownloadCallbacks = {
  onProgress: (progress: DownloadProgress) => void;
};
