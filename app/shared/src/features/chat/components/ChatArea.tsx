import { ChatMessageItem } from "@/features/chat/components/messages";
import { useChatMessages } from "@/features/chat/hooks/use-chat-messages";
import { cn } from "@/lib/utils";
import { useThreadStore } from "@/store/threadStore";

export const ChatArea = () => {
  const { activeThreadId } = useThreadStore();
  const { messages, isLoading } = useChatMessages(activeThreadId);

  if (activeThreadId === null) {
    return (
      <div className="app-ask-main app-ask-thread">
        <div className={cn("app-ask-thread-inner", "app-ask-empty")}>
          <p className="app-ask-empty-text">
            Select a thread or send a message to start.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="app-ask-main app-ask-thread">
        <div className={cn("app-ask-thread-inner", "app-ask-empty")}>
          <p className="app-ask-empty-text">Loading…</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="app-ask-main app-ask-thread">
        <div className={cn("app-ask-thread-inner", "app-ask-empty")}>
          <p className="app-ask-empty-text">No messages yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-ask-main app-ask-thread">
      <div className="app-ask-thread-inner">
        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};
