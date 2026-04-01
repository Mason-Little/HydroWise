import type { Db } from "@/types/db";

export async function enableExtensions(db: Db) {
  await db.execute(`CREATE EXTENSION IF NOT EXISTS vector`);
}
