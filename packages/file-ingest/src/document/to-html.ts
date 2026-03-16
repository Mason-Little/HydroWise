import { getConverter } from "../init";

export const toHtml = async (file: File): Promise<string> => {
  const converter = getConverter();
  const buffer = await file.arrayBuffer();
  const result = await converter.convert(
    new Uint8Array(buffer),
    { outputFormat: "html" },
    file.name,
  );
  return new TextDecoder().decode(result.data);
};
