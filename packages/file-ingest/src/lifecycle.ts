import {
  createWasmPaths,
  WorkerBrowserConverter,
} from "@matbee/libreoffice-converter/browser";

const wasmBase = "/wasm/libreoffice/";
const workerJs = "/assets/lo-browser-worker.js";

function createConverter(): WorkerBrowserConverter {
  return new WorkerBrowserConverter({
    ...createWasmPaths(wasmBase),
    browserWorkerJs: workerJs,
    verbose: false,
  });
}

export async function withConverter<T>(
  fn: (converter: WorkerBrowserConverter) => Promise<T>,
  timeoutMs = 30_000,
): Promise<T> {
  const converter = createConverter();
  await converter.initialize();

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error("[file-ingest] Conversion timed out. Please try again.")),
      timeoutMs,
    );
  });

  try {
    return await Promise.race([fn(converter), timeout]);
  } finally {
    clearTimeout(timeoutId);
    converter.destroy().catch(() => {});
  }
}
