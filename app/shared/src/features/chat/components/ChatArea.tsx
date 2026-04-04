import { useChatContext } from "@/features/chat/context";
import { useChatMessages } from "@/features/chat/hooks/use-chat-messages";

const emptyCenter =
  "text-muted-foreground flex flex-1 min-h-0 items-center justify-center text-sm";

export const ChatArea = () => {
  const { threadId } = useChatContext();
  const { messages, isLoading } = useChatMessages(threadId);

  if (threadId === null) {
    return (
      <div className={`${emptyCenter} px-2 text-center`}>
        Select a thread or send a message to start.
      </div>
    );
  }

  if (isLoading) {
    return <div className={emptyCenter}>Loading…</div>;
  }

  if (messages.length === 0) {
    return <div className={emptyCenter}>No messages yet.</div>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-2">
      {messages.map((m) => {
        const isUser = m.role === "user";
        return (
          <div
            key={m.id}
            className={
              isUser
                ? "bg-muted ml-auto max-w-[85%] rounded-2xl px-3 py-2 text-sm"
                : "border-border bg-background mr-auto max-w-[85%] rounded-2xl border px-3 py-2 text-sm"
            }
          >
            <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-wide uppercase">
              {isUser ? "You" : "HydroWise"}
            </p>
            <p className="whitespace-pre-wrap">{m.payload.text}</p>
          </div>
        );
      })}
    </div>
  );
};
