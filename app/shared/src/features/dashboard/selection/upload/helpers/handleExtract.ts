import { extractText } from "@hydrowise/ai-runtime";
import { useModelStore } from "@/store/modelStore";

export const handleExtract = async (pages: Blob[]) => {
  const { warmVisionModel, coolVisionModel } = useModelStore.getState();

  await warmVisionModel();

  const texts: string[] = [];
  for (const [index, page] of pages.entries()) {
    console.log(`[upload] page ${index + 1}/${pages.length}: extracting text…`);
    texts.push(await extractText(page));
  }

  await coolVisionModel();

  console.log(`[upload] all pages extracted`, { pageCount: texts.length });
  return texts;
};
