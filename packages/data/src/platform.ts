import { createDb } from "@hydrowise/db";

const DB_DATA_DIRS = {
  desktop: "idb://hydrowise-desktop",
  web: "idb://hydrowise",
} as const;

export async function createDbForPlatform(opts: {
  platform: "web" | "desktop";
}) {
  if (opts.platform === "web") {
    return createDb({ dataDir: DB_DATA_DIRS.web });
  }

  if (opts.platform === "desktop") {
    return createDb({ dataDir: DB_DATA_DIRS.desktop });
  }

  throw new Error("Unknown platform");
}
