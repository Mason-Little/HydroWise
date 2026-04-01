import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import type { DbWithClient } from "@/client/createDb";
import { createDrizzleDb } from "@/client/createDb";
import { runBundledMigrations } from "@/client/migrate-bundled";

type CreateDbOptions = {
  dataDir: string;
};

export async function createDb({
  dataDir,
}: CreateDbOptions): Promise<DbWithClient> {
  const client = await PGlite.create({
    dataDir,
    extensions: { vector },
  });

  return createDrizzleDb(client, { runMigrations: runBundledMigrations });
}
