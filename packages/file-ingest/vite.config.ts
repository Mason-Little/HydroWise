import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [dts({ include: ["src"], rollupTypes: false })],

  build: {
    lib: {
      entry: { index: path.join(root, "src", "index.ts") },
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^@hydrowise\//],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    },
  },

  resolve: {
    alias: { "@": path.join(root, "src") },
  },
});
