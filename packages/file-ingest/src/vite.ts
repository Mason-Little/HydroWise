import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";

const WASM_URL_PREFIX = "/wasm/libreoffice/";
const WORKER_URL = "/assets/lo-browser-worker.js";

const COOP = "Cross-Origin-Opener-Policy";
const COEP = "Cross-Origin-Embedder-Policy";

const MIME: Record<string, string> = {
  ".js": "application/javascript",
  ".cjs": "application/javascript",
  ".wasm": "application/wasm",
  ".data": "application/octet-stream",
};

function resolveLibraryPaths(): { wasmDir: string; workerFile: string } {
  const require = createRequire(import.meta.url);
  // Resolve via the wasm/loader export to get the wasm directory path.
  const loaderPath = require.resolve(
    "@matbee/libreoffice-converter/wasm/loader",
  );
  const wasmDir = path.dirname(loaderPath);
  const workerFile = path.join(
    path.dirname(wasmDir),
    "dist",
    "browser.worker.global.js",
  );
  return { wasmDir, workerFile };
}

function setCorsIsolationHeaders(res: {
  setHeader(name: string, value: string): void;
}): void {
  res.setHeader(COOP, "same-origin");
  res.setHeader(COEP, "require-corp");
}

export function hydrowiseFileIngestPlugin(): Plugin[] {
  const { wasmDir, workerFile } = resolveLibraryPaths();

  // Plugin 1: dev server — serve WASM assets and inject COOP/COEP on all responses.
  const servePlugin: Plugin = {
    name: "hydrowise-file-ingest:serve",
    apply: "serve",
    configureServer(server) {
      // Inject COOP/COEP on every dev-server response. SharedArrayBuffer (required
      // by Emscripten pthreads) is only available in cross-origin isolated contexts.
      server.middlewares.use((_req, res, next) => {
        setCorsIsolationHeaders(res);
        next();
      });

      // Serve WASM files and the browser worker from the installed package.
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? "").split("?")[0];

        if (url.startsWith(WASM_URL_PREFIX)) {
          const filename = url.slice(WASM_URL_PREFIX.length);
          const filePath = path.join(wasmDir, filename);

          if (existsSync(filePath)) {
            const ext = path.extname(filePath);
            res.setHeader(
              "Content-Type",
              MIME[ext] ?? "application/octet-stream",
            );
            setCorsIsolationHeaders(res);
            res.end(readFileSync(filePath));
            return;
          }
        }

        if (url === WORKER_URL && existsSync(workerFile)) {
          res.setHeader("Content-Type", "application/javascript");
          setCorsIsolationHeaders(res);
          res.end(readFileSync(workerFile));
          return;
        }

        next();
      });
    },
  };

  // Plugin 2: production build — copy WASM files and the browser worker into dist.
  // Uses fs.copyFileSync in closeBundle rather than emitFile to avoid loading
  // ~200MB of binary data into Node.js heap.
  let resolvedOutDir = "";

  const buildPlugin: Plugin = {
    name: "hydrowise-file-ingest:build",
    apply: "build",
    configResolved(config: ResolvedConfig) {
      resolvedOutDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const wasmOutDir = path.join(resolvedOutDir, "wasm", "libreoffice");
      const assetsOutDir = path.join(resolvedOutDir, "assets");

      mkdirSync(wasmOutDir, { recursive: true });
      mkdirSync(assetsOutDir, { recursive: true });

      for (const filename of readdirSync(wasmDir)) {
        copyFileSync(
          path.join(wasmDir, filename),
          path.join(wasmOutDir, filename),
        );
      }

      copyFileSync(workerFile, path.join(assetsOutDir, "lo-browser-worker.js"));
    },
  };

  return [servePlugin, buildPlugin];
}
