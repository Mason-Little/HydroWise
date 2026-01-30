import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "HydrowiseLlmClient",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["@mlc-ai/web-llm"],
      output: {
        globals: {
          "@mlc-ai/web-llm": "WebLLM",
        },
      },
    },
  },
});
