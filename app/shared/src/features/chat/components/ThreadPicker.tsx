import { useChatContext } from "@/features/chat/context";
import { useChatThreads } from "@/features/chat/hooks/use-chat-threads";

const threadLabel = (id: string, title: string | null) =>
  title?.trim() || `${id.slice(0, 8)}…`;

export const ThreadPicker = () => {
  const { threads, isLoading } = useChatThreads();
  const { threadId, selectThread } = useChatContext();

  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor="chat-thread" className="text-muted-foreground shrink-0">
        Thread
      </label>
      <select
        id="chat-thread"
        className="border-input bg-background flex min-w-0 flex-1 rounded-md border px-2 py-1.5 text-sm"
        value={threadId ?? ""}
        disabled={isLoading}
        onChange={(e) => selectThread(e.target.value || null)}
      >
        <option value="">New chat</option>
        {threads.map((t) => (
          <option key={t.id} value={t.id}>
            {threadLabel(t.id, t.title)}
          </option>
        ))}
      </select>
    </div>
  );
};
