import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { DEFAULT_SOCKET_HOST, DEFAULT_SOCKET_PORT } from "./constants";

export type ViewerOptions = {
  host?: string;
  port?: number;
  snapshot: Uint8Array;
};

export type ViewerHandle = {
  connectionString: string;
  host: string;
  port: number;
  stop: () => Promise<void>;
};

export async function startViewerDb(
  options: ViewerOptions,
): Promise<ViewerHandle> {
  const host = options.host ?? DEFAULT_SOCKET_HOST;
  const port = options.port ?? DEFAULT_SOCKET_PORT;
  const snapshot = options.snapshot.slice();

  const db = await PGlite.create({
    loadDataDir: new File([snapshot], "hydrowise-db-view.tgz"),
    extensions: { vector },
  });

  const server = new PGLiteSocketServer({
    db,
    host,
    port,
  });

  try {
    await server.start();
  } catch (error) {
    await db.close();

    if (isAddressInUseError(error)) {
      throw new Error(
        `Viewer port ${port} is already in use. Stop the other process or choose a different port.`,
      );
    }

    throw error;
  }

  return {
    connectionString: `postgresql://postgres:postgres@${host}:${port}/postgres`,
    host,
    port,
    async stop(): Promise<void> {
      await server.stop();
      await db.close();
    },
  };
}

function isAddressInUseError(
  error: unknown,
): error is Error & { code: string } {
  return (
    error instanceof Error && "code" in error && error.code === "EADDRINUSE"
  );
}
