import { heicTo } from "heic-to";

async function blobToPng(blob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  const MAX = 1024;
  const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error(`[file-ingest] Failed to get canvas context`);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.convertToBlob({ type: "image/png" });
}

export async function rasterToPngPages(file: File): Promise<Blob[]> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "heic" || ext === "heif") {
    const converted = await heicTo({ blob: file, type: "image/png" });
    if (!(converted instanceof Blob)) {
      throw new Error(`[file-ingest] HEIC conversion failed: ${file.name}`);
    }
    return [await blobToPng(converted)];
  }

  return [await blobToPng(file)];
}
