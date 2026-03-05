import { PGlite } from "@electric-sql/pglite";
import { createDb } from "../client/createDb";

export async function createDesktopDb(path: string) {
  const client = new PGlite(path);

  return createDb(client);
}
