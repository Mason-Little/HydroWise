import path from "node:path";
import { fileURLToPath } from "node:url";
import DrizzleMigrations from "@proj-airi/unplugin-drizzle-orm-migrations/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    DrizzleMigrations(),
    dts({ include: ["src"], rollupTypes: false }),
  ],

  build: {
    lib: {
      entry: {
        index: path.join(root, "src", "index.ts"),
        "schema/index": path.join(root, "src", "schema", "index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^@hydrowise\//, /^@electric-sql\//, /^drizzle-orm/],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    },
  },

  resolve: {
    alias: { "@": path.join(root, "src") },
  },

  define: {
    __MIGRATIONS_DIR__: JSON.stringify(path.join(root, "drizzle")),
  },
});
