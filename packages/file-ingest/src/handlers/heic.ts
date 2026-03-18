import { heicTo } from "heic-to";
import type { NormalizedPage } from "../types";
import { OUTPUT_MIME_TYPE } from "../types";
import { rasterFileToNormalizedPage } from "./raster";

export async function heicFileToNormalizedPage(file: File): Promise<NormalizedPage> {
  const converted = await heicTo({ blob: file, type: "image/png" });

  if (!(converted instanceof Blob)) {
    throw new Error(`[file-ingest] HEIC conversion failed: ${file.name}`);
  }

  return rasterFileToNormalizedPage(
    new File([converted], `${file.name}.png`, { type: OUTPUT_MIME_TYPE }),
  );
}
