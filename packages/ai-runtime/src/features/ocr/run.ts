import { generateText } from "ai";
import { getVisionModel } from "@/runtime";
import { blobScaledForOcr } from "./downscale-for-ocr";

export const extractText = async (image: Blob): Promise<string> => {
  const scaledImage = await blobScaledForOcr(image);
  const { text } = await generateText({
    model: getVisionModel(),
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: await scaledImage.arrayBuffer() }],
      },
    ],
  });
  return text;
};
