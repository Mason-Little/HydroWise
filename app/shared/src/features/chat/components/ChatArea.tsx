import { ChatMessageBubble } from "@/features/chat/components/ChatMessageBubble";
import { useChatContext } from "@/features/chat/context";
import { useChatMessages } from "@/features/chat/hooks/use-chat-messages";

const emptyCenter =
  "text-muted-foreground flex flex-1 min-h-0 items-center justify-center text-sm";

export const ChatArea = () => {
  const { threadId, assistantDraft } = useChatContext();
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

  const hasDraft = assistantDraft != null;
  const hasListContent = messages.length > 0 || hasDraft;

  if (!hasListContent) {
    return <div className={emptyCenter}>No messages yet.</div>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-2">
      {messages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
};
