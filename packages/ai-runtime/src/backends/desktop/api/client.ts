import { DESKTOP_SERVER_ORIGIN } from "@/backends/desktop/constants";
import { ensureDesktopServerReady } from "@/backends/desktop/readiness";

type DesktopRequest = {
  path: string;
  init?: RequestInit;
};

// Ensures server readiness, then fetches a path on the desktop server.
export async function desktopFetch(request: DesktopRequest): Promise<Response> {
  await ensureDesktopServerReady();
  return desktopFetchRaw(request);
}

// Fetches JSON from the desktop server and returns parsed T.
export async function desktopFetchJson<T>(request: DesktopRequest): Promise<T> {
  const response = await desktopFetch(request);
  return (await response.json()) as T;
}

// Fetches a path on the desktop server without waiting for readiness.
// Use this only when bypassing the readiness check is intentional (e.g. the readiness poller itself).
export async function desktopFetchRaw(
  request: DesktopRequest,
): Promise<Response> {
  const response = await fetch(createDesktopUrl(request.path), {
    ...request.init,
    headers: {
      "content-type": "application/json",
      ...request.init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Desktop model server request failed: ${await toErrorMessage(response)}`,
    );
  }

  return response;
}

// Builds the full URL for a path on the desktop server.
const createDesktopUrl = (path: string): string => {
  return new URL(path, `${DESKTOP_SERVER_ORIGIN}/`).toString();
};

// Turns a failed response into a short status + body string.
const toErrorMessage = async (response: Response): Promise<string> => {
  const body = await response.text();
  return body ? `${response.status} ${body}` : `${response.status}`;
};
