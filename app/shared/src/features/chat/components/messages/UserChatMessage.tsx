import type { ChatMessage } from "@hydrowise/entities";

type UserChatMessageProps = {
  message: ChatMessage;
};

export const UserChatMessage = ({ message }: UserChatMessageProps) => {
  if (message.payload.kind !== "user-text") {
    return null;
  }

  return (
    <div className="bg-muted ml-auto max-w-[85%] rounded-2xl px-3 py-2 text-sm">
      <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-wide uppercase">
        You
      </p>
      <p className="whitespace-pre-wrap">{message.payload.text}</p>
    </div>
  );
};
