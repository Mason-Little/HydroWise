import { parseDocx } from "@/lib/document/parsers/docx";
import { parseImage } from "@/lib/document/parsers/image";
import { parsePdf } from "@/lib/document/parsers/pdf";
import { parsePptx } from "@/lib/document/parsers/pptx";
import { getDocumentType } from "@/lib/document/util/extension-type";

export const parseDocument = async (file: File) => {
  const documentType = getDocumentType(file);
  switch (documentType) {
    case "pdf":
      return parsePdf(file);
    case "docx":
      return parseDocx(file);
    case "pptx":
      return parsePptx(file);
    case "image":
      return parseImage(file);
    default:
      throw new Error(`Unsupported file type: ${file.type}`);
  }
};
