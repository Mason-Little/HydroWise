import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatContext } from "@/features/chat/context";

export const ChatInput = () => {
  const [text, setText] = useState("");
  const { sendMessage, isStreaming } = useChatContext();
  const trimmed = text.trim();
  const canSend = trimmed.length > 0 && !isStreaming;

  const handleSubmit = () => {
    if (!canSend) {
      return;
    }
    sendMessage(trimmed);
    setText("");
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        className="min-w-0 flex-1"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <Button onClick={handleSubmit} disabled={!canSend}>
        Send
      </Button>
    </div>
  );
};
