import { generateText } from "ai";
import { getVisionModel } from "../../../init/image/index";

export const processImage = async (base64: string): Promise<string> => {
  const result = await generateText({
    model: await getVisionModel(),
    temperature: 0,
    topP: 1,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Transcribe the following image" },
          { type: "image", image: base64 },
        ],
      },
    ],
  });

  const text = result.text;
  return text;
};
