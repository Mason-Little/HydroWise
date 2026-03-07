import { Buffer } from "node:buffer";
import { DEFAULT_APP_URL, SNAPSHOT_PATH } from "./constants";

type SnapshotResponse = {
  snapshotBase64?: string;
  error?: string;
};

export type SnapshotOptions = {
  appUrl?: string;
};

export async function fetchSnapshot(
  options: SnapshotOptions,
): Promise<Uint8Array> {
  const appUrl = options.appUrl ?? DEFAULT_APP_URL;
  const url = new URL(SNAPSHOT_PATH, ensureTrailingSlash(appUrl));

  let response: Response;

  try {
    response = await fetch(url, {
      headers: { accept: "application/json" },
    });
  } catch (error) {
    throw new Error(
      `Could not reach the web app at ${appUrl}. Start @hydrowise/web and keep a dev browser tab open.`,
      { cause: error },
    );
  }

  const payload = (await response.json()) as SnapshotResponse;

  if (!response.ok) {
    throw new Error(
      payload.error ?? `Snapshot request failed with HTTP ${response.status}.`,
    );
  }

  if (!payload.snapshotBase64) {
    throw new Error("Snapshot export hook returned no data.");
  }

  return decodeBase64(payload.snapshotBase64);
}

function ensureTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

function decodeBase64(value: string): Uint8Array {
  const buffer = Buffer.from(value, "base64");
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
}
