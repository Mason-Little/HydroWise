import { generateText } from "ai";
import { getLanguageModel } from "../../../init/language";
import { ocrCorrectionPrompt } from "./config";

export const generateOcrCorrection = async (
  ocrText: string,
): Promise<string> => {
  const result = await generateText({
    system: ocrCorrectionPrompt,
    model: await getLanguageModel(),
    temperature: 0,
    topP: 1,
    prompt: ocrText,
  });

  return result.text;
};
