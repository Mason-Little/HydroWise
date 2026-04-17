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
    <div className="mx-auto max-w-[920px]">
      <p className="mb-2 flex items-center gap-2 text-[length:var(--type-dashboard-micro)] text-[var(--app-text-muted)]">
        <span className="font-medium uppercase tracking-[0.18em]">Scope</span>
        <span>Course workspace</span>
      </p>
      <div className="flex items-center gap-2 rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--app-border-solid)_66%,transparent)] bg-[color-mix(in_srgb,var(--app-surface-primary)_94%,var(--app-workspace-bg))] p-2 shadow-[0_1px_0_rgba(255,255,255,0.72)_inset,0_10px_30px_rgba(37,50,58,0.06)] transition-shadow focus-within:shadow-[0_1px_0_rgba(255,255,255,0.72)_inset,0_12px_34px_rgba(37,50,58,0.08)]">
        <Input
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-[length:var(--type-dashboard-body)] shadow-none focus-visible:ring-0"
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
          className="shrink-0 bg-[var(--btn-download-bg)] text-[var(--btn-download-text)] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] hover:bg-[color-mix(in_srgb,var(--btn-download-bg)_88%,white)]"
          onClick={handleSubmit}
          disabled={!canSend}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
