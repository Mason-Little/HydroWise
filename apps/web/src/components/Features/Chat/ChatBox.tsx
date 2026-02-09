import type { ConversationMessage } from "@hydrowise/entities";
import { useState } from "react";
import { ChatInput } from "@/components/Features/Chat/ui/chat-input";
import { MessageArea } from "@/components/Features/Chat/ui/message-area";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useConversation } from "@/hooks/conversation/useConversation";
import { useMessages } from "@/hooks/query/message.queries";
import { convertTextToMessage } from "@/lib/prompt/text-to-message";

export const ChatBox = () => {
  const { messages } = useMessages();
  const { handleSendMessage, isStreaming } = useConversation();
  const [streamingContent, setStreamingContent] = useState("");

  const onChunk = (chunk: string) => {
    setStreamingContent((previous) => previous + chunk);
  };

  const displayedMessages: ConversationMessage[] = [
    ...messages,
    ...(streamingContent
      ? [convertTextToMessage(streamingContent, "assistant")]
      : []),
  ];

  const handleSend = async (message: string) => {
    setStreamingContent("");
    try {
      await handleSendMessage(message, onChunk);
    } finally {
      setStreamingContent("");
    }
  };

  return (
    <Card className="mx-auto flex h-[calc(100svh-1.5rem)] w-full max-w-4xl border-border/70 bg-card/90 py-0 shadow-sm backdrop-blur-sm md:h-[calc(100svh-2.5rem)]">
      <CardHeader className="border-b border-border/60 py-4">
        <CardTitle className="text-sm font-semibold tracking-tight">
          HydroWise Chat
        </CardTitle>
      </CardHeader>
      <MessageArea messages={displayedMessages} />
      <Separator />
      <ChatInput disabled={isStreaming} onSend={handleSend} />
    </Card>
  );
};
