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
    <div className="app-ask-composer-shell">
      <p className="app-ask-composer-scope">
        <span className="app-ask-composer-scope-label">Scope</span>
        <span className="app-ask-composer-scope-hint">Course workspace</span>
      </p>
      <div className="app-ask-composer-surface">
        <Input
          className="app-ask-composer-input min-w-0 flex-1"
          placeholder="Ask anything…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button
          type="button"
          className="app-ask-send shrink-0"
          onClick={handleSubmit}
          disabled={!canSend}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
