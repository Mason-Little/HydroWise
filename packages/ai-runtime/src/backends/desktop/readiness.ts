import { desktopFetchRaw } from "@/backends/desktop/api/client";

const DEFAULT_WAIT_ATTEMPTS = 30;
const DEFAULT_WAIT_DELAY_MS = 500;

const serverReadiness = {
  isReady: false,
  pending: null as Promise<void> | null,
};

const sleep = (delayMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delayMs));

// Polls v1/models until the server returns a 200 or attempts are exhausted.
const pollUntilReady = async (): Promise<void> => {
  for (let attempt = 0; attempt < DEFAULT_WAIT_ATTEMPTS; attempt += 1) {
    try {
      await desktopFetchRaw({ path: "v1/models" });
      serverReadiness.isReady = true;
      return;
    } catch {
      if (attempt < DEFAULT_WAIT_ATTEMPTS - 1) {
        await sleep(DEFAULT_WAIT_DELAY_MS);
      }
    }
  }

  throw new Error(
    `Desktop model server did not become ready after ${DEFAULT_WAIT_ATTEMPTS} attempts.`,
  );
};

// Resolves when the desktop server is ready to accept requests.
// Concurrent callers share a single in-flight poll — no redundant retries.
export const ensureDesktopServerReady = async (): Promise<void> => {
  if (serverReadiness.isReady) return;
  if (serverReadiness.pending) return serverReadiness.pending;

  const poll = pollUntilReady();
  serverReadiness.pending = poll;

  try {
    await poll;
  } finally {
    if (serverReadiness.pending === poll) {
      serverReadiness.pending = null;
    }
  }
};

// Called after a server restart to force re-polling on the next request.
export const invalidateDesktopServerReadiness = (): void => {
  serverReadiness.isReady = false;
  serverReadiness.pending = null;
};
