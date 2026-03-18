import { encode } from "uint8-to-base64";

export async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  return encode(new Uint8Array(buffer));
}
