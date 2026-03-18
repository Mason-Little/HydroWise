import imageCompression from "browser-image-compression";
import { blobToBase64 } from "@/encode";
import { IMAGE_MAX_DIMENSION, type NormalizedPage, OUTPUT_MIME_TYPE } from "@/types";

async function getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("[file-ingest] Failed to load normalized image."));
      img.src = objectUrl;
    });
    return { width: image.naturalWidth, height: image.naturalHeight };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function rasterFileToNormalizedPage(file: File): Promise<NormalizedPage> {
  const compressed = await imageCompression(file, {
    maxWidthOrHeight: IMAGE_MAX_DIMENSION,
    useWebWorker: true,
    fileType: OUTPUT_MIME_TYPE,
    initialQuality: 1,
  });

  const [base64, dimensions] = await Promise.all([
    blobToBase64(compressed),
    getImageDimensions(compressed),
  ]);

  return { mimeType: OUTPUT_MIME_TYPE, base64, ...dimensions };
}
