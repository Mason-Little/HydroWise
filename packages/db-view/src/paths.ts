import path from "node:path";
import { fileURLToPath } from "node:url";

export const PACKAGE_ROOT = path.dirname(
  fileURLToPath(new URL("../package.json", import.meta.url)),
);
export const REPO_ROOT = path.resolve(PACKAGE_ROOT, "../..");

export const DRIZZLE_CONFIG_PATH = path.join(
  REPO_ROOT,
  "packages/db/drizzle.config.ts",
);
