import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "drizzle-kit";

const configDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  dialect: "postgresql",
  schema: path.join(configDir, "src/schema/index.ts"),
  out: path.join(configDir, "drizzle"),
  dbCredentials: { url: process.env.DATABASE_URL ?? "./studio-db/" },
});
