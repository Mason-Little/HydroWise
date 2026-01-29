import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { getWebLLMEngine } from "./init";

const DEFAULT_MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
const DEFAULT_TEMPERATURE = 0.6;
const DEFAULT_MAX_TOKENS = 128;

export const sendChatCompletion = async (
  messages: ChatCompletionMessageParam[],
): Promise<string> => {
  const engine = getWebLLMEngine();
  const completion = await engine.chat.completions.create({
    stream: false,
    messages,
    model: DEFAULT_MODEL,
    temperature: DEFAULT_TEMPERATURE,
    max_tokens: DEFAULT_MAX_TOKENS,
  });

  return completion.choices[0]?.message?.content ?? "";
};
