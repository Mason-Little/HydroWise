import { type ChildProcess, spawn } from "node:child_process";
import { DEFAULT_STUDIO_HOST, DEFAULT_STUDIO_PORT } from "./constants";
import { DRIZZLE_CONFIG_PATH, REPO_ROOT } from "./paths";

export type StudioOptions = {
  connectionString: string;
  host?: string;
  port?: number;
};

export type StudioHandle = {
  host: string;
  port: number;
  stop: () => Promise<void>;
};

export async function startStudio(
  options: StudioOptions,
): Promise<StudioHandle> {
  const host = options.host ?? DEFAULT_STUDIO_HOST;
  const port = options.port ?? DEFAULT_STUDIO_PORT;

  const child = spawn(
    "bun",
    [
      "x",
      "drizzle-kit",
      "studio",
      "--config",
      DRIZZLE_CONFIG_PATH,
      "--host",
      host,
      "--port",
      String(port),
    ],
    {
      cwd: REPO_ROOT,
      env: {
        ...process.env,
        DATABASE_URL: options.connectionString,
      },
      stdio: "inherit",
    },
  );

  await waitForStudioSpawn(child, port);

  return {
    host,
    port,
    async stop(): Promise<void> {
      await stopChild(child);
    },
  };
}

function waitForStudioSpawn(child: ChildProcess, port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false;

    function rejectOnce(error: Error): void {
      if (settled) {
        return;
      }

      settled = true;
      reject(error);
    }

    child.once("error", function handleError(error: Error): void {
      if (isAddressInUseError(error)) {
        rejectOnce(
          new Error(
            `Drizzle Studio port ${port} is already in use. Stop the other process or choose a different port.`,
          ),
        );
        return;
      }

      rejectOnce(error);
    });

    child.once("spawn", function handleSpawn(): void {
      if (settled) {
        return;
      }

      settled = true;
      resolve();
    });

    child.once(
      "exit",
      function handleExit(
        code: number | null,
        signal: NodeJS.Signals | null,
      ): void {
        rejectOnce(
          new Error(
            `Drizzle Studio exited before startup (code=${String(code)} signal=${String(signal)}).`,
          ),
        );
      },
    );
  });
}

async function stopChild(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.signalCode !== null) {
    return;
  }

  await new Promise<void>((resolve) => {
    child.once("exit", function handleExit(): void {
      resolve();
    });
    child.kill("SIGINT");
  });
}

function isAddressInUseError(
  error: unknown,
): error is Error & { code: string } {
  return (
    error instanceof Error && "code" in error && error.code === "EADDRINUSE"
  );
}
