import type { LanguageModelV3Prompt } from "@ai-sdk/provider";

type MessageContent =
  | string
  | Array<{ type: string; text?: string } & Record<string, unknown>>;

const extractText = (content: MessageContent): string => {
  if (typeof content === "string") return content;
  return content
    .filter(
      (p) => (p.type === "text" || p.type === "reasoning") && p.text != null,
    )
    .map((p) => p.text as string)
    .join("\n");
};

const toTextParts = (content: MessageContent) => {
  if (typeof content === "string") return [{ type: "text", text: content }];
  return content
    .filter((p) => p.type === "text")
    .map((p) => ({
      type: "text",
      text: (p as { type: "text"; text: string }).text,
    }));
};

export const toConversation = (prompt: LanguageModelV3Prompt) =>
  prompt.flatMap((message) => {
    if (message.role === "system" || message.role === "assistant") {
      const text = extractText(message.content as MessageContent);
      return [{ role: message.role, content: [{ type: "text", text }] }];
    }

    if (message.role === "user") {
      const parts = toTextParts(message.content as MessageContent);
      return [
        {
          role: "user",
          content: parts.length > 0 ? parts : [{ type: "text", text: "" }],
        },
      ];
    }

    return [];
  });
