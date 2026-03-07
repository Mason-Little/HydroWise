import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [dts({ include: ["src/vite.ts", "src/constants.ts"], rollupTypes: false })],

  build: {
    lib: {
      entry: {
        vite: path.join(root, "src", "vite.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^node:/],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    },
  },
});
