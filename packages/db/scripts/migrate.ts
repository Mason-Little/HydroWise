import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { createPGliteClient } from "../src/pglite";
import * as schema from "../src/schema";

const DB_DIR = process.env.DB_URL ?? "./studio-db/";
const MIGRATIONS_DIR = resolve(
  fileURLToPath(new URL("..", import.meta.url)),
  "migrations",
);

const client = await createPGliteClient(DB_DIR);

const db = drizzle(client, { schema });
await migrate(db, { migrationsFolder: MIGRATIONS_DIR });

console.log("Migrations applied.");
await client.close();
