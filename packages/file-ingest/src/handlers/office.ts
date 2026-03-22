import type { InputFormat } from "@matbee/libreoffice-converter/browser";
import { getConverter } from "@/init";

export async function officeToPngPages(file: File): Promise<Blob[]> {
  const converter = getConverter();
  const input = new Uint8Array(await file.arrayBuffer());
  const ext = file.name.split(".").at(-1);
  if (!ext) throw new Error(`[file-ingest] Missing extension: ${file.name}`);
  const inputFormat = ext.toLowerCase() as InputFormat;
  const pageCount = await converter.getPageCount(input, { inputFormat });

  return Promise.all(
    Array.from({ length: pageCount }, (_, i) =>
      converter.renderPageViaConvert(input, { inputFormat }, i).then((page) => {
        const png = new Uint8Array(page.data);
        return new Blob([png], { type: "image/png" });
      }),
    ),
  );
}
