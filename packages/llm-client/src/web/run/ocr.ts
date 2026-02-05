import { generateText } from "ai";
import { ocrCorrectionPrompt } from "../../config/ocr-correction-prompt";
import { getWebLLMEngine } from "../init/chat";

export const postprocessWebOcrText = async (
  ocrText: string,
): Promise<string> => {
  const result = await generateText({
    model: getWebLLMEngine(),
    temperature: 0,
    messages: [
      {
        role: "system",
        content: ocrCorrectionPrompt,
      },
      {
        role: "user",
        content: ocrText,
      },
    ],
  });

  return result.text;
};
