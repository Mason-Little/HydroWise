import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema.js";

export const createDesktopClient = (dbPath: string) => {
  const client = new PGlite(dbPath, { extensions: { vector } });
  return drizzle(client, { schema });
};
