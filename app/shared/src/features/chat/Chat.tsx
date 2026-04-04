import { ChatArea } from "@/features/chat/components/ChatArea";
import { ChatInput } from "@/features/chat/components/ChatInput";
import { ThreadPicker } from "@/features/chat/components/ThreadPicker";
import { ChatProvider } from "@/features/chat/context";

export const Chat = () => {
  return (
    <ChatProvider>
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <header className="shrink-0 space-y-0.5">
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Workspace tutor
          </p>
          <h1 className="text-lg font-semibold">Ask HydroWise</h1>
        </header>
        <ThreadPicker />
        <ChatArea />
        <div className="shrink-0">
          <ChatInput />
        </div>
      </div>
    </ChatProvider>
  );
};
