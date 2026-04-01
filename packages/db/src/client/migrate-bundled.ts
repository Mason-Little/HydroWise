import migrations from "virtual:drizzle-migrations.sql";
import { migrate } from "@proj-airi/drizzle-orm-browser-migrator/pglite";
import type { Db } from "@/types/db";

export async function runBundledMigrations(db: Db): Promise<void> {
  await migrate(db, migrations);
}
