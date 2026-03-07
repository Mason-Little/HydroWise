import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// Keep this sourced directly in local dev so Vite uses the latest db-view
// plugin changes instead of a stale built package artifact.
import { hydrowiseDbViewPlugin } from "../../packages/db-view/src/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), hydrowiseDbViewPlugin()],
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
