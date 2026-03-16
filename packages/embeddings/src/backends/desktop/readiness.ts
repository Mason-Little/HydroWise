import { requestDesktopEmbedding } from "@/backends/desktop/api/client";

const DEFAULT_WAIT_ATTEMPTS = 30;
const DEFAULT_WAIT_DELAY_MS = 500;

const sleep = async (delayMs: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
};

export const waitForDesktopEmbeddingServerReady = async (): Promise<void> => {
  for (let attempt = 0; attempt < DEFAULT_WAIT_ATTEMPTS; attempt += 1) {
    try {
      await requestDesktopEmbedding({ path: "v1/models" });
      return;
    } catch {
      if (attempt < DEFAULT_WAIT_ATTEMPTS - 1) {
        await sleep(DEFAULT_WAIT_DELAY_MS);
      }
    }
  }

  throw new Error(
    `Desktop embeddings server did not become ready after ${DEFAULT_WAIT_ATTEMPTS} attempts.`,
  );
};
