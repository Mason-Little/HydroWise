import type { LanguageModelId } from "@hydrowise/ai-runtime";

const downloadIntervals = new Map<
  LanguageModelId,
  ReturnType<typeof setInterval>
>();

let warmupTimeout: ReturnType<typeof setTimeout> | null = null;

export const setDownloadInterval = (
  id: LanguageModelId,
  interval: ReturnType<typeof setInterval>,
) => {
  clearDownloadInterval(id);
  downloadIntervals.set(id, interval);
};

export const clearDownloadInterval = (id: LanguageModelId) => {
  const interval = downloadIntervals.get(id);
  if (!interval) {
    return;
  }

  clearInterval(interval);
  downloadIntervals.delete(id);
};

export const clearWarmupTimeout = () => {
  if (!warmupTimeout) {
    return;
  }

  clearTimeout(warmupTimeout);
  warmupTimeout = null;
};

export const setWarmupTimeout = (timeout: ReturnType<typeof setTimeout>) => {
  clearWarmupTimeout();
  warmupTimeout = timeout;
};

export const resetWarmupTimeout = () => {
  warmupTimeout = null;
};
