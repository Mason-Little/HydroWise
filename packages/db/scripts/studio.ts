/**
 * Starts the PGlite bridge then hands off to drizzle-kit studio, passing the
 * bridge URL via DATABASE_URL so drizzle.config.ts switches to TCP mode.
 *
 * The bridge process stays alive for the duration of the studio session.
 * Ctrl+C kills both.
 */

import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import { startBridge } from "./bridge";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function waitForPort(port: number, timeout = 5000): Promise<void> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const open = await new Promise<boolean>((resolve) => {
      const sock = createConnection({ port, host: "127.0.0.1" });
      sock.once("connect", () => {
        sock.destroy();
        resolve(true);
      });
      sock.once("error", () => resolve(false));
    });
    if (open) return;
    await sleep(100);
  }
  throw new Error(`Port ${port} did not open within ${timeout}ms`);
}

const { url, port } = await startBridge();
console.log(`Bridge ready at ${url}`);

await waitForPort(port);

const drizzleKit = spawn("bunx", ["drizzle-kit", "studio"], {
  env: { ...process.env, DATABASE_URL: url },
  stdio: "inherit",
});

// Mirror drizzle-kit's exit code and clean up on our own Ctrl+C.
process.on("SIGINT", () => {
  drizzleKit.kill();
  process.exit(0);
});

const code = await new Promise<number>((resolve) => {
  drizzleKit.on("close", (exitCode) => resolve(exitCode ?? 1));
});

process.exit(code);
