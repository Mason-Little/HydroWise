import {
  createWasmPaths,
  WorkerBrowserConverter,
} from "@matbee/libreoffice-converter/browser";

export interface FileIngestConfig {
  /** Base URL where the WASM files are served. Defaults to "/wasm/libreoffice/". */
  wasmBase?: string;
  /** URL of the browser worker script. Defaults to "/assets/lo-browser-worker.js". */
  workerJs?: string;
}

let converter: WorkerBrowserConverter | null = null;
let initPromise: Promise<void> | null = null;

export const initFileIngest = async (
  config?: FileIngestConfig,
): Promise<void> => {
  if (initPromise) {
    await initPromise;
    return;
  }

  const wasmBase = config?.wasmBase ?? "/wasm/libreoffice/";
  const workerJs = config?.workerJs ?? "/assets/lo-browser-worker.js";

  const nextConverter = new WorkerBrowserConverter({
    ...createWasmPaths(wasmBase),
    browserWorkerJs: workerJs,
  });

  converter = nextConverter;
  initPromise = nextConverter.initialize().catch((error) => {
    console.error("[file-ingest] init failed", error);
    if (converter === nextConverter) {
      converter = null;
    }

    initPromise = null;
    throw error;
  });

  await initPromise;
};

export function getConverter(): WorkerBrowserConverter {
  if (!converter) {
    throw new Error(
      "[file-ingest] initFileIngest() must be awaited before converting documents.",
    );
  }
  return converter;
}
