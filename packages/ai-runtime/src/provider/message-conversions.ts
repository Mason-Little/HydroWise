import type { LanguageModelV3Prompt } from "@ai-sdk/provider";
import type { WebChatMessage, WebChatPart } from "../backends/web/chat";

/** Coerce AI SDK file/image data to WebChatPart image (string | URL | Blob). */
const toImagePartValue = (
  data: unknown,
  mediaType?: string,
): string | URL | Blob | undefined => {
  if (typeof data === "string") return data;
  if (data instanceof URL) return data;
  if (data instanceof Blob) return data;
  if (data instanceof Uint8Array)
    return new Blob([data.buffer as ArrayBuffer], {
      type: mediaType ?? "application/octet-stream",
    });
  return undefined;
};

const normalizeAssistantOrSystemMessage = (
  role: "assistant" | "system",
  content:
    | string
    | Array<{ type: string; text?: string } & Record<string, unknown>>,
): WebChatMessage => {
  if (typeof content === "string") {
    return { role, content };
  }

  const text = content
    .flatMap((part) => {
      if (part.type === "text" || part.type === "reasoning") {
        return part.text != null ? [part.text] : [];
      }
      return [];
    })
    .join("\n");

  return { role, content: text || "" };
};

const normalizeUserMessage = (
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "file"; data: unknown; mediaType: string; filename?: string }
        | { type: "image"; image: unknown; mediaType?: string }
      >,
): WebChatMessage => {
  if (typeof content === "string") {
    return { role: "user", content };
  }

  const parts: WebChatPart[] = [];

  for (const part of content) {
    if (part.type === "text") {
      parts.push({ type: "text", text: part.text });
      continue;
    }
    if (part.type === "file") {
      const image = toImagePartValue(part.data, part.mediaType);
      if (image !== undefined) {
        parts.push({ type: "image", image });
      }
      continue;
    }
    if (part.type === "image") {
      const image = toImagePartValue(part.image, part.mediaType);
      if (image !== undefined) {
        parts.push({ type: "image", image });
      }
    }
  }

  return {
    role: "user",
    content: parts.length > 0 ? parts : "",
  };
};

export const toWebChatMessages = (
  messages: LanguageModelV3Prompt,
): WebChatMessage[] =>
  messages.flatMap((message) => {
    if (message.role === "system") {
      return [normalizeAssistantOrSystemMessage("system", message.content)];
    }
    if (message.role === "assistant") {
      return [
        normalizeAssistantOrSystemMessage(
          "assistant",
          message.content as Array<
            { type: string; text?: string } & Record<string, unknown>
          >,
        ),
      ];
    }
    if (message.role === "user") {
      return [normalizeUserMessage(message.content)];
    }
    return [];
  });
