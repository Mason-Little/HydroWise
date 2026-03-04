import { drizzle } from "drizzle-orm/pglite";
import { createPGliteClient } from "./pglite";
import * as schema from "./schema/index";

export type Database = Awaited<ReturnType<typeof createDb>>;
export type DbClient = Database["db"];

/**
 * Create a PGlite-backed Drizzle database with pgvector loaded.
 */
export async function createDb(dataDir: string) {
  const client = await createPGliteClient(dataDir);

  const db = drizzle(client, { schema });

  return { db, client };
}
