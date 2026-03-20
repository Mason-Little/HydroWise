import type { InputFormat } from "@matbee/libreoffice-converter/browser";
import { encode } from "uint8-to-base64";
import { getConverter } from "@/init";

const PAGE_RENDER_WIDTH = 1024;

function getInputFormat(file: File): InputFormat {
  return file.name.split(".").pop()!.toLowerCase() as InputFormat;
}

async function renderPagesAsBase64(
  file: File,
  inputFormat: InputFormat,
): Promise<string[]> {
  const converter = getConverter();
  const inputData = new Uint8Array(await file.arrayBuffer());
  const pageCount = await converter.getPageCount(inputData, { inputFormat });

  const pageRenders = [];
  for (let i = 0; i < pageCount; i++) {
    pageRenders.push(
      converter
        .renderPageViaConvert(inputData, { inputFormat }, i, PAGE_RENDER_WIDTH)
        .then((preview) => encode(preview.data)),
    );
  }
  return Promise.all(pageRenders);
}

export async function officeToPngPages(file: File): Promise<string[]> {
  return renderPagesAsBase64(file, getInputFormat(file));
}
