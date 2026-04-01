import { generateText } from "ai";
import { getVisionModel } from "@/runtime";

export const extractText = async (image: Blob): Promise<string> => {
  const { text } = await generateText({
    model: getVisionModel(),
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: await image.arrayBuffer() }],
      },
    ],
  });
  return text;
};
