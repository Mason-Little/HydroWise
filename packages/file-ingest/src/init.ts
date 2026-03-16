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

export const initFileIngest = async (
  config?: FileIngestConfig,
): Promise<void> => {
  const wasmBase = config?.wasmBase ?? "/wasm/libreoffice/";
  const workerJs = config?.workerJs ?? "/assets/lo-browser-worker.js";

  converter = new WorkerBrowserConverter({
    ...createWasmPaths(wasmBase),
    browserWorkerJs: workerJs,
  });

  await converter.initialize();
};

export function getConverter(): WorkerBrowserConverter {
  if (!converter) {
    throw new Error(
      "[file-ingest] initFileIngest() must be awaited before converting documents.",
    );
  }
  return converter;
}
