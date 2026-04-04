import type { ChatMessage } from "@hydrowise/entities";

type ChatMessageBubbleProps = {
  message: ChatMessage;
};

export const ChatMessageBubble = ({ message }: ChatMessageBubbleProps) => {
  const isUser = message.role === "user";
  const bubbleClassName = isUser
    ? "bg-muted ml-auto max-w-[85%] rounded-2xl px-3 py-2 text-sm"
    : "border-border bg-background mr-auto max-w-[85%] rounded-2xl border px-3 py-2 text-sm";
  const speakerLabel = isUser ? "You" : "HydroWise";

  return (
    <div className={bubbleClassName}>
      <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-wide uppercase">
        {speakerLabel}
      </p>
      <p className="whitespace-pre-wrap">{message.payload.text}</p>
    </div>
  );
};
