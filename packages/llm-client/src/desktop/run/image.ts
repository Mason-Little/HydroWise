import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const getOpenAIClient = () =>
  createOpenAI({
    baseURL: import.meta.env.VITE_DESKTOP_VISION_ENDPOINT,
    apiKey: "null",
  });

const FileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

export const processDesktopImage = async (input: File): Promise<string> => {
  const openai = getOpenAIClient();
  const base64 = await FileToBase64(input);
  const result = await generateText({
    model: openai.chat("any"),
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
