import { createDesktopDb, createWebDb } from "@hydrowise/db";

export async function createDbForPlatform(opts: {
  platform: "web" | "desktop";
  desktopDbDir?: string;
}) {
  if (opts.platform === "web") {
    return createWebDb();
  }

  if (opts.platform === "desktop") {
    if (!opts.desktopDbDir) {
      throw new Error("desktopDbDir required");
    }
    return createDesktopDb(opts.desktopDbDir);
  }

  throw new Error("Unknown platform");
}
