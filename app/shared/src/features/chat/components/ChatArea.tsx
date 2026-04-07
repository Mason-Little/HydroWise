import { ChatMessageItem } from "@/features/chat/components/messages";
import { useChatContext } from "@/features/chat/context";
import { useChatDisplayMessages } from "@/features/chat/hooks/use-chat-display-messages";
import { cn } from "@/lib/utils";
import { useThreadStore } from "@/store/threadStore";

const emptyCenter =
  "text-muted-foreground flex flex-1 min-h-0 items-center justify-center text-sm";

export const ChatArea = () => {
  const { assistantDraft } = useChatContext();
  const { activeThreadId } = useThreadStore();
  const { messages, isLoading } = useChatDisplayMessages(
    activeThreadId,
    assistantDraft,
  );

  if (activeThreadId === null) {
    return (
      <div className={cn(emptyCenter, "px-2 text-center")}>
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
      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};
