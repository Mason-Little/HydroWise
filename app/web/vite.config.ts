import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// Keep these sourced directly in local dev so Vite uses the latest plugin
// changes instead of stale built package artifacts.
import { hydrowiseDbViewPlugin } from "../../packages/db-view/src/vite";
import { hydrowiseFileIngestPlugin } from "../../packages/file-ingest/src/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), hydrowiseDbViewPlugin(), hydrowiseFileIngestPlugin()],
  optimizeDeps: {
    exclude: ["@electric-sql/pglite", "@electric-sql/pglite/vector"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../shared/src", import.meta.url)),
      "@shared": fileURLToPath(new URL("../shared/src", import.meta.url)),
      "@web": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
