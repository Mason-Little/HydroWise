import { generateOcrCorrection, processImage } from "@hydrowise/llm-client";
import { heicTo, isHeic } from "heic-to";

const convertHeicToPng = async (file: File): Promise<File> => {
  const converted = await heicTo({
    blob: file,
    type: "image/png",
  });

  if (!(converted instanceof Blob)) {
    throw new Error("HEIC conversion did not return a valid image blob");
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([converted], `${baseName}.png`, { type: "image/png" });
};

const normalizeImageForOcr = async (file: File): Promise<File> => {
  const mimeType = file.type.toLowerCase();
  const isHeicImage = await isHeic(file).catch(() => false);

  if (isHeicImage) {
    return convertHeicToPng(file);
  }

  if (!mimeType || mimeType.startsWith("image/")) {
    return file;
  }

  throw new Error(
    `Unsupported image format for OCR normalization: ${file.type}`,
  );
};

export const parseImage = async (image: File) => {
  try {
    const normalizedImage = await normalizeImageForOcr(image);
    const result = await processImage(normalizedImage);
    const markdown = await generateOcrCorrection(result);
    return {
      text: markdown,
      pageCount: 1,
    };
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    const heicHint = details.includes("ERR_LIBHEIF format not supported")
      ? " This HEIC variant is not supported by the local decoder. Export it as JPEG or PNG in Photos and upload that copy."
      : "";
    throw new Error(
      `Failed to decode image for OCR. File: ${image.name}, MIME type: ${image.type || "unknown"}. ${details}${heicHint}`,
    );
  }
};
