import { ChatInput } from "@/components/conversation/chat-input";
import { MessageArea } from "@/components/conversation/message-area";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMessages } from "@/hooks/conversation/message.queries";
import { useChatStore } from "@/store/chatStore";

export const ChatBox = () => {
  const { selectedChatId } = useChatStore();

  const { messages, isLoading, error, sendMessage } = useMessages(
    selectedChatId || "",
  );

  if (isLoading) {
    return (
      <div className="text-muted-foreground m-auto text-sm">
        Loading conversation...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive m-auto text-sm">
        Error: {error.message}
      </div>
    );
  }

  return (
    <Card className="mx-auto flex h-[calc(100svh-1.5rem)] w-full max-w-4xl border-border/70 bg-card/90 py-0 shadow-sm backdrop-blur-sm md:h-[calc(100svh-2.5rem)]">
      <CardHeader className="border-b border-border/60 py-4">
        <CardTitle className="text-sm font-semibold tracking-tight">
          {selectedChatId ? "HydroWise Chat" : "Pick or create a chat"}
        </CardTitle>
      </CardHeader>
      <MessageArea messages={messages} />
      <Separator />
      <ChatInput onSend={(message) => sendMessage(message)} />
    </Card>
  );
};
