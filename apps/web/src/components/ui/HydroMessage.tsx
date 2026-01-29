import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";

type Props = {
  message: ChatCompletionMessageParam;
};

const getMessageContent = (message: ChatCompletionMessageParam) => {
  if (typeof message.content === "string") return message.content;
  if (!message.content) return "";
  return message.content
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
};

export const HydroMessage = ({ message }: Props) => {
  const isUser = message.role === "user";

  const content = getMessageContent(message);

  return (
    <div className={`message ${isUser ? "message-user" : "message-glass"}`}>
      {content}
    </div>
  );
};
