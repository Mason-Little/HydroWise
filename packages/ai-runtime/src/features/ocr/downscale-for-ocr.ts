import { RawImage } from "@huggingface/transformers";

const MAX_OCR_LONG_EDGE = 512;

export async function blobScaledForOcr(blob: Blob): Promise<Blob> {
  const raw = await RawImage.fromBlob(blob);
  const longEdge = Math.max(raw.width, raw.height);

  if (longEdge <= MAX_OCR_LONG_EDGE) {
    return blob;
  }

  const scale = MAX_OCR_LONG_EDGE / longEdge;
  const resized = await raw.resize(
    Math.round(raw.width * scale),
    Math.round(raw.height * scale),
  );

  return resized.toBlob("image/png");
}
