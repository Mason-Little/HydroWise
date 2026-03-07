import type { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "@/schema";
import type { Db } from "@/types/db";
import { enableExtensions } from "./extensions";
import type { RunMigrationsFn } from "./run-migrations";

export type DbWithClient = Db & { $client: PGlite };

export async function createDrizzleDb(
  client: PGlite,
  options: { runMigrations: RunMigrationsFn },
): Promise<DbWithClient> {
  const db = drizzle(client, { schema });

  await enableExtensions(db);
  await options.runMigrations(db);

  return db as DbWithClient;
}
