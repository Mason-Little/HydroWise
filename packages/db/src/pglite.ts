import { existsSync, mkdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";

export async function createPGliteClient(dataDir: string) {
  if (!dataDir.startsWith("idb://") && !existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  const client = new PGlite(dataDir, { extensions: { vector } });
  await client.query("CREATE EXTENSION IF NOT EXISTS vector;");

  return client;
}
