import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";

export const sendDesktopChatCompletion = async (
  messages: ChatCompletionMessageParam[],
): Promise<string> => {
  const response = await fetch(
    `${import.meta.env.VITE_DESKTOP_ENDPOINT}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
        messages,
      }),
    },
  );

  const data = await response.json();
  return data.choices[0].message.content;
};
