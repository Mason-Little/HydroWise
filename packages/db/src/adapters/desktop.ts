import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import { createDb } from "@/client/createDb";
import { runFilesystemMigrations } from "@/client/migrate-filesystem";

export async function createDesktopDb(path: string) {
  const client = await PGlite.create(path, { extensions: { vector } });

  return createDb(client, { runMigrations: runFilesystemMigrations });
}
