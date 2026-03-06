/**
 * Run migrations from the filesystem (packages/db/drizzle).
 * Used only by the desktop adapter. Path is injected at build time (Vite define)
 * so this file uses no Node APIs and can be included in the shared lib build.
 */
import { migrate } from "drizzle-orm/pglite/migrator";
import type { Db } from "@/types/db";

declare const __MIGRATIONS_DIR__: string;

export async function runFilesystemMigrations(db: Db): Promise<void> {
  try {
    await migrate(db, { migrationsFolder: __MIGRATIONS_DIR__ });
  } catch (error) {
    // Empty migrations folder (e.g. fresh desktop install): no journal yet.
    if (
      error instanceof Error &&
      error.message.includes("Can't find meta/_journal.json file")
    ) {
      return;
    }
    throw error;
  }
}
