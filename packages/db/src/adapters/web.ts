import { PGlite } from "@electric-sql/pglite";
import { createDb } from "../client/createDb";

export async function createWebDb() {
  const client = new PGlite({
    dataDir: "idb://hydrowise",
  });

  return createDb(client);
}
