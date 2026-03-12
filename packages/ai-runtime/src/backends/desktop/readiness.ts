import { requestDesktop } from "@/backends/desktop/api/client";

const DEFAULT_WAIT_ATTEMPTS = 30;
const DEFAULT_WAIT_DELAY_MS = 500;

// Resolves after the given delay in ms.
const sleep = async (delayMs: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
};

// Polls the desktop server until it responds or attempts are exhausted.
export const waitForDesktopServerReady = async (): Promise<void> => {
  for (let attempt = 0; attempt < DEFAULT_WAIT_ATTEMPTS; attempt += 1) {
    try {
      await requestDesktop({ path: "v1/models" });
      return;
    } catch {
      if (attempt < DEFAULT_WAIT_ATTEMPTS - 1) {
        await sleep(DEFAULT_WAIT_DELAY_MS);
      }
    }
  }

  throw new Error(
    `Desktop language-model server did not become ready after ${DEFAULT_WAIT_ATTEMPTS} attempts.`,
  );
};
