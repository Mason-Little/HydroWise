import { generateText } from "ai";
import { getVisionModel } from "../../../init/image/index";

const FileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

export const processImage = async (input: File): Promise<string> => {
  const base64 = await FileToBase64(input);
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
