import { fileURLToPath } from "node:url";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { createPGliteClient } from "../src/pglite";

const DB_DIR = process.env.DB_URL ?? "./studio-db/";
// Default to 5433 to avoid colliding with a real Postgres on 5432.
const PORT = Number(process.env.BRIDGE_PORT ?? 5433);
const HOST = "127.0.0.1";

export async function startBridge(opts?: { port?: number; dbDir?: string }) {
  const dbDir = opts?.dbDir ?? DB_DIR;
  const port = opts?.port ?? PORT;
  const client = await createPGliteClient(dbDir);

  const server = new PGLiteSocketServer({ db: client, port, host: HOST });
  await server.start();

  // PGlite exposes a single logical database; the wire-protocol name is "template1".
  const url = `postgresql://postgres@${HOST}:${port}/template1?sslmode=disable`;

  return { server, client, url, port };
}

// Run directly: bun scripts/bridge.ts
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { url } = await startBridge();

  console.log(`\nPGlite bridge running at ${url}`);
  console.log("Connect with any Postgres client. SSL is not supported.\n");

  const shutdown = async () => {
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
