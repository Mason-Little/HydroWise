import { pptxToHtml } from "@jvmr/pptx-to-html";
import { gfm } from "@truto/turndown-plugin-gfm";
import TurndownService from "turndown";

const createTurndown = () => {
  const turndown = new TurndownService({
    codeBlockStyle: "fenced",
  });

  turndown.use(gfm);
  turndown.addRule("removeImages", {
    filter: "img",
    replacement: () => "",
  });

  return turndown;
};

export const parsePptx = async (file: File) => {
  const slidesHtml = await pptxToHtml(await file.arrayBuffer());
  const turndown = createTurndown();

  const slidesMarkdown = slidesHtml.map((slideHtml, index) => {
    const markdown = turndown.turndown(slideHtml).trim();
    const heading = `## Slide ${index + 1}`;
    return markdown ? `${heading}\n\n${markdown}` : heading;
  });

  return {
    text: slidesMarkdown.join("\n\n"),
    pageCount: slidesHtml.length || null,
  };
};
