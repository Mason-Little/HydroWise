import { heicTo } from "heic-to";
import { encode } from "uint8-to-base64";

async function blobToPngBase64(blob: Blob): Promise<string> {
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const pngBlob = await canvas.convertToBlob({ type: "image/png" });
  const buffer = await pngBlob.arrayBuffer();
  return encode(new Uint8Array(buffer));
}

export async function rasterToPngPages(file: File): Promise<string[]> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "heic" || ext === "heif") {
    const converted = await heicTo({ blob: file, type: "image/png" });
    if (!(converted instanceof Blob)) {
      throw new Error(`[file-ingest] HEIC conversion failed: ${file.name}`);
    }
    return [await blobToPngBase64(converted)];
  }

  return [await blobToPngBase64(file)];
}
