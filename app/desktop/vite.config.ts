import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// Keep this sourced directly in local dev so Vite uses the latest plugin
// changes instead of a stale built package artifact.
import { hydrowiseFileIngestPlugin } from "../../packages/file-ingest/src/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), hydrowiseFileIngestPlugin()],
  optimizeDeps: {
    exclude: ["@electric-sql/pglite", "@electric-sql/pglite/vector"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../shared/src", import.meta.url)),
      "@shared": fileURLToPath(new URL("../shared/src", import.meta.url)),
      "@desktop": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
});
