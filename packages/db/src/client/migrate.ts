import { migrate } from "drizzle-orm/pglite/migrator";
import type { Db } from "../types/db";

export async function runMigrations(db: Db) {
  await migrate(db, {
    migrationsFolder: "./migrations",
  });
}
