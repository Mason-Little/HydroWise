import type http from "node:http";
import type { HtmlTagDescriptor, Plugin } from "vite";
import {
  RESOLVED_VIRTUAL_CLIENT_MODULE_ID,
  SNAPSHOT_ENDPOINT,
  SNAPSHOT_REQUEST_EVENT,
  SNAPSHOT_RESPONSE_EVENT,
  SNAPSHOT_TIMEOUT_MS,
  VIRTUAL_CLIENT_MODULE_ID,
} from "./constants";

const VIRTUAL_MODULE_ID_PREFIX = "/@id/";
const VIRTUAL_CLIENT_MODULE_SRC = `/@id/${encodeURIComponent(VIRTUAL_CLIENT_MODULE_ID)}`;
const JSON_CONTENT_TYPE = "application/json";
const SNAPSHOT_EXPORT_ERROR = "Failed to export browser database snapshot.";
const SNAPSHOT_MISSING_DATA_ERROR = "Snapshot export hook returned no data.";
const SNAPSHOT_TIMEOUT_ERROR =
  "No dev browser responded. Make sure @hydrowise/web is running and open in a browser tab.";

type SnapshotPayload = {
  snapshotBase64: string;
};

type SnapshotResponsePayload = {
  requestId?: string;
  snapshotBase64?: string;
  error?: string;
};

type PendingRequest = {
  resolve: (payload: SnapshotPayload) => void;
  reject: (error: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
};

type DevServer = {
  ws: {
    on: (
      event: string,
      handler: (payload: SnapshotResponsePayload) => void,
    ) => void;
    send: (event: string, payload: { requestId: string }) => void;
  };
  middlewares: {
    use: (
      path: string,
      handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
    ) => void;
  };
};

export function hydrowiseDbViewPlugin(): Plugin {
  return {
    name: "hydrowise-db-view",
    apply: "serve",
    resolveId(id: string): string | undefined {
      if (isVirtualClientModuleId(id)) {
        return RESOLVED_VIRTUAL_CLIENT_MODULE_ID;
      }
    },
    load(id: string): string | null {
      if (id !== RESOLVED_VIRTUAL_CLIENT_MODULE_ID) {
        return null;
      }

      return getVirtualClientModuleSource();
    },
    transformIndexHtml(): HtmlTagDescriptor[] {
      return [
        {
          tag: "script",
          attrs: {
            type: "module",
            src: VIRTUAL_CLIENT_MODULE_SRC,
          },
          injectTo: "head",
        },
      ];
    },
    configureServer(server: DevServer): void {
      installSnapshotEndpoint(server);
    },
  };
}

function isVirtualClientModuleId(id: string): boolean {
  const normalizedId = normalizeVirtualModuleId(id);

  return (
    normalizedId === VIRTUAL_CLIENT_MODULE_ID ||
    normalizedId === RESOLVED_VIRTUAL_CLIENT_MODULE_ID
  );
}

function normalizeVirtualModuleId(id: string): string {
  if (id.startsWith(VIRTUAL_MODULE_ID_PREFIX)) {
    return safeDecodeURIComponent(id.slice(VIRTUAL_MODULE_ID_PREFIX.length));
  }

  return safeDecodeURIComponent(id);
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getVirtualClientModuleSource(): string {
  return `
const { dumpDbDataDir } = await import("@hydrowise/data");

function encodeBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

if (import.meta.hot) {
  import.meta.hot.on(${JSON.stringify(SNAPSHOT_REQUEST_EVENT)}, async (payload) => {
    const requestId = payload?.requestId;

    if (!requestId) {
      import.meta.hot?.send(${JSON.stringify(SNAPSHOT_RESPONSE_EVENT)}, {
        error: "Missing snapshot request id.",
      });
      return;
    }

    try {
      const snapshot = await dumpDbDataDir();

      import.meta.hot?.send(${JSON.stringify(SNAPSHOT_RESPONSE_EVENT)}, {
        requestId,
        snapshotBase64: encodeBase64(snapshot),
      });
    } catch (error) {
      import.meta.hot?.send(${JSON.stringify(SNAPSHOT_RESPONSE_EVENT)}, {
        requestId,
        error:
          error instanceof Error
            ? error.message
            : ${JSON.stringify(SNAPSHOT_EXPORT_ERROR)},
      });
    }
  });
}
`;
}

function installSnapshotEndpoint(server: DevServer): void {
  const pendingRequests = new Map<string, PendingRequest>();

  server.ws.on(
    SNAPSHOT_RESPONSE_EVENT,
    function handleSnapshotResponse(payload: SnapshotResponsePayload): void {
      const requestId = payload?.requestId;
      if (!requestId) {
        return;
      }

      const pending = pendingRequests.get(requestId);
      if (!pending) {
        return;
      }

      clearPendingRequest(pendingRequests, requestId, pending);

      if (payload.error) {
        pending.reject(new Error(payload.error));
        return;
      }

      if (!payload.snapshotBase64) {
        pending.reject(new Error(SNAPSHOT_MISSING_DATA_ERROR));
        return;
      }

      pending.resolve({ snapshotBase64: payload.snapshotBase64 });
    },
  );

  server.middlewares.use(
    SNAPSHOT_ENDPOINT,
    async (req: http.IncomingMessage, res: http.ServerResponse) => {
      if (req.method !== "GET") {
        sendJson(res, 405, { error: "Method not allowed" });
        return;
      }

      const requestId = crypto.randomUUID();

      try {
        const snapshot = await requestSnapshotFromBrowser(
          server,
          pendingRequests,
          requestId,
        );
        sendJson(res, 200, snapshot);
      } catch (error) {
        sendJson(res, 503, { error: getErrorMessage(error) });
      }
    },
  );
}

function requestSnapshotFromBrowser(
  server: DevServer,
  pendingRequests: Map<string, PendingRequest>,
  requestId: string,
): Promise<SnapshotPayload> {
  return new Promise(function waitForSnapshot(resolve, reject) {
    const timeout = setTimeout(() => {
      pendingRequests.delete(requestId);
      reject(new Error(SNAPSHOT_TIMEOUT_ERROR));
    }, SNAPSHOT_TIMEOUT_MS);

    pendingRequests.set(requestId, {
      resolve,
      reject,
      timeout,
    });

    server.ws.send(SNAPSHOT_REQUEST_EVENT, { requestId });
  });
}

function clearPendingRequest(
  pendingRequests: Map<string, PendingRequest>,
  requestId: string,
  pending: PendingRequest,
): void {
  clearTimeout(pending.timeout);
  pendingRequests.delete(requestId);
}

function sendJson(
  res: http.ServerResponse,
  statusCode: number,
  body: SnapshotPayload | { error: string },
): void {
  res.statusCode = statusCode;
  res.setHeader("content-type", JSON_CONTENT_TYPE);
  res.end(JSON.stringify(body));
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : SNAPSHOT_EXPORT_ERROR;
}
