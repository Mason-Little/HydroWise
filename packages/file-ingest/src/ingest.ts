import { convertImage } from "./converter/image";
import { convertOffice } from "./converter/office";
import { convertPdf } from "./converter/pdf";
import { detectFileKind } from "./detector";

export const ingestFile = async (file: File): Promise<void> => {
  console.log(
    "[file-ingest] received file:",
    file.name,
    file.type,
    file.size,
    "bytes",
  );

  const kind = detectFileKind(file);

  switch (kind) {
    case "image":
      await convertImage(file);
      break;
    case "pdf":
      await convertPdf(file);
      break;
    case "document":
      await convertOffice(file);
      break;
    case "unsupported":
      console.warn("[file-ingest] unsupported file type:", file.type);
      break;
  }
};
