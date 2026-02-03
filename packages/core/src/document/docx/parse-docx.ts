import { gfm } from "@truto/turndown-plugin-gfm";
import { convertToHtml } from "mammoth";
import TurndownService from "turndown";

export const parseDocx = async (file: File) => {
  const { value } = await convertToHtml({
    arrayBuffer: await file.arrayBuffer(),
  });

  const turndown = new TurndownService({
    codeBlockStyle: "fenced",
  });
  turndown.use(gfm);

  const markdown = turndown.turndown(value ?? "");

  console.log(markdown);

  return { text: markdown, pageCount: null };
};
