import { DESKTOP_SERVER_ORIGIN } from "@/backends/desktop/constants";

// Builds the full URL for a path on the desktop server.
const createDesktopUrl = (path: string): string => {
  return new URL(path, `${DESKTOP_SERVER_ORIGIN}/`).toString();
};

type DesktopRequest = {
  path: string;
  init?: RequestInit;
};

// Turns a failed response into a short status + body string.
const toErrorMessage = async (response: Response): Promise<string> => {
  const body = await response.text();
  return body ? `${response.status} ${body}` : `${response.status}`;
};

// Fetches a path on the desktop server and throws if not ok.
export const requestDesktop = async (
  request: DesktopRequest,
): Promise<Response> => {
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
};

// Fetches JSON from the desktop server and returns parsed T.
export const requestDesktopJson = async <T>(
  request: DesktopRequest,
): Promise<T> => {
  const response = await requestDesktop(request);
  return (await response.json()) as T;
};

// Fetches a path on the desktop server and discards the response.
export const requestDesktopVoid = async (
  request: DesktopRequest,
): Promise<void> => {
  await requestDesktop(request);
};
