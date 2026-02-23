import { generateText } from "ai";
import { getLanguageModel } from "../../../init/language";
import { ocrCorrectionPrompt } from "./config";

export const postprocessDesktopOcrText = async (
  ocrText: string,
): Promise<string> => {
  const model = getLanguageModel();
  const result = await generateText({
    system: ocrCorrectionPrompt,
    model,
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
