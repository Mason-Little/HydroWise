import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import { createDb } from "@/client/createDb";
import { runBundledMigrations } from "@/client/migrate-bundled";

export async function createWebDb() {
  const client = await PGlite.create({
    dataDir: "idb://hydrowise",
    extensions: { vector },
  });

  return createDb(client, { runMigrations: runBundledMigrations });
}
