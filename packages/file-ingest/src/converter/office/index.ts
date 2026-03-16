import { toHtml } from "../../document/to-html";

export const convertOffice = async (file: File): Promise<string> => {
  const html = await toHtml(file);
  return html;
};
