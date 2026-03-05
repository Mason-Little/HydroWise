import type { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { enableExtensions } from "./extensions";
import { runMigrations } from "./migrate";
import * as schema from "../schema";

export async function createDb(client: PGlite) {
  const db = drizzle(client, { schema });

  await enableExtensions(db);
  await runMigrations(db);

  return db;
}
