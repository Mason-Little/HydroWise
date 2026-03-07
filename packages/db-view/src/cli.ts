import {
  DEFAULT_APP_URL,
  DEFAULT_SOCKET_PORT,
  DEFAULT_STUDIO_PORT,
} from "./constants";
import { fetchSnapshot } from "./fetchSnapshot";
import { startStudio } from "./startStudio";
import { startViewerDb } from "./startViewerDb";

type CliOptions = {
  appUrl: string;
  viewerPort: number;
  studioPort: number;
};

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  console.log(`Fetching browser snapshot from ${options.appUrl}...`);
  const snapshot = await fetchSnapshot({ appUrl: options.appUrl });
  console.log(`Snapshot received (${snapshot.byteLength} bytes).`);

  console.log(`Starting local PGlite viewer on port ${options.viewerPort}...`);
  const viewer = await startViewerDb({
    snapshot,
    port: options.viewerPort,
  });

  console.log(`Viewer DB ready at ${viewer.connectionString}`);

  let studioStopped = false;
  const studio = await startStudio({
    connectionString: viewer.connectionString,
    port: options.studioPort,
  });

  async function shutdown(): Promise<void> {
    if (!studioStopped) {
      studioStopped = true;
      await studio.stop();
      await viewer.stop();
    }
  }

  process.once("SIGINT", function handleSigint(): void {
    void shutdown().finally(() => process.exit(0));
  });

  process.once("SIGTERM", function handleSigterm(): void {
    void shutdown().finally(() => process.exit(0));
  });

  console.log(
    `Drizzle Studio should open on http://${studio.host}:${studio.port}`,
  );
  console.log("Press Ctrl+C to stop the viewer.");
}

void main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`db:view failed: ${message}`);
  process.exit(1);
});

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    appUrl: DEFAULT_APP_URL,
    viewerPort: DEFAULT_SOCKET_PORT,
    studioPort: DEFAULT_STUDIO_PORT,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === "--app-url" && next) {
      options.appUrl = next;
      index += 1;
      continue;
    }

    if (arg === "--viewer-port" && next) {
      options.viewerPort = parsePort(next, "viewer");
      index += 1;
      continue;
    }

    if (arg === "--studio-port" && next) {
      options.studioPort = parsePort(next, "studio");
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function parsePort(value: string, label: string): number {
  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid ${label} port: ${value}`);
  }

  return port;
}
