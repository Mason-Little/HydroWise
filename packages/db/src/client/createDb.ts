import type { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "@/schema";
import { enableExtensions } from "./extensions";
import type { RunMigrationsFn } from "./run-migrations";

export async function createDrizzleDb(
  client: PGlite,
  options: { runMigrations: RunMigrationsFn },
) {
  const db = drizzle(client, { schema });

  await enableExtensions(db);
  await options.runMigrations(db);

  return db;
}
