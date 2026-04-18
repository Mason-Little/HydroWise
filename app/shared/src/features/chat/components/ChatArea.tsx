import { ChatMessageItem } from "@/features/chat/components/messages";
import { useChatContext } from "@/features/chat/context";

export const ChatArea = () => {
  const { session, messages, isLoading } = useChatContext();

  if (session.status === "draft") {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex min-h-full max-w-[920px] items-center justify-center">
          <p className="max-w-[60ch] text-center text-[length:var(--type-dashboard-body)] leading-relaxed text-[var(--app-text-muted)]">
            Select a thread or send a message to start.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex min-h-full max-w-[920px] items-center justify-center">
          <p className="text-[length:var(--type-dashboard-body)] text-[var(--app-text-muted)]">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex min-h-full max-w-[920px] items-center justify-center">
          <p className="text-[length:var(--type-dashboard-body)] text-[var(--app-text-muted)]">
            No messages yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin] [overscroll-behavior:contain]">
      <div className="mx-auto flex max-w-[920px] flex-col gap-4">
        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};
