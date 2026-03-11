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
