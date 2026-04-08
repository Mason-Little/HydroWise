import { ChatArea } from "@/features/chat/components/ChatArea";
import { ChatInput } from "@/features/chat/components/ChatInput";
import { ChatProvider } from "@/features/chat/context";

export const Chat = () => {
  return (
    <ChatProvider>
      <div className="app-ask-shell flex min-h-0 flex-1 flex-col">
        <div className="app-ask-workspace flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <header className="app-ask-header shrink-0">
            <p className="app-ask-kicker">Workspace tutor</p>
            <h1 className="app-ask-title">Ask HydroWise</h1>
          </header>
          <ChatArea />
          <div className="app-ask-composer-outer shrink-0">
            <ChatInput />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};
