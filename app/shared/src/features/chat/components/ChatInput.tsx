import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatContext } from "@/features/chat/context";

export const ChatInput = () => {
  const [text, setText] = useState("");
  const { sendMessage, isStreaming } = useChatContext();
  const trimmed = text.trim();
  const canSend = trimmed.length > 0 && !isStreaming;

  const handleSend = async () => {
    if (!canSend) return;
    await sendMessage(trimmed);
    setText("");
  };

  return (
    <div>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />
      <Button onClick={handleSend} disabled={!canSend}>
        Send
      </Button>
    </div>
  );
};
