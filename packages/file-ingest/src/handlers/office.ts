import type { InputFormat } from "@matbee/libreoffice-converter/browser";
import { getFileExtension } from "@/classify";
import { withConverter } from "@/lifecycle";

export async function fileToPdf(file: File, ext: string): Promise<Uint8Array> {
  if (ext === "pdf") return new Uint8Array(await file.arrayBuffer());
  return withConverter((c) =>
    c
      .convertFile(file, {
        inputFormat: ext as InputFormat,
        outputFormat: "pdf",
      })
      .then((r) => new Uint8Array(r.data)),
  );
}

export async function officeToPngPages(file: File): Promise<Blob[]> {
  const input = new Uint8Array(await file.arrayBuffer());
  const inputFormat = getFileExtension(file) as InputFormat;
  return withConverter(async (c) => {
    const pageCount = await c.getPageCount(input, { inputFormat });
    return Promise.all(
      Array.from({ length: pageCount }, (_, i) =>
        c
          .renderPageViaConvert(input, { inputFormat }, i, 512)
          .then(
            (page) =>
              new Blob([new Uint8Array(page.data)], { type: "image/png" }),
          ),
      ),
    );
  });
}
