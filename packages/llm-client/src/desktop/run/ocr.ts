import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { ocrCorrectionPrompt } from "../../config/ocr-correction-prompt";

const getOpenAIClient = () =>
  createOpenAI({
    baseURL: import.meta.env.VITE_DESKTOP_GEN_ENDPOINT,
    apiKey: "null",
  });

export const postprocessDesktopOcrText = async (
  ocrText: string,
): Promise<string> => {
  const openai = getOpenAIClient();
  const result = await generateText({
    system: ocrCorrectionPrompt,
    model: openai.chat("any"),
    temperature: 0,
    topP: 1,
    messages: [
      {
        role: "user",
        content: ocrText,
      },
    ],
  });

  return result.text;
};
