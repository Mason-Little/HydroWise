import type { ChatMessage } from "@hydrowise/entities";

type UserChatMessageProps = {
  message: ChatMessage;
};

export const UserChatMessage = ({ message }: UserChatMessageProps) => {
  if (message.payload.kind !== "user-text") {
    return null;
  }

  return (
    <div className="ml-auto flex max-w-[min(80%,72ch)] flex-col items-end gap-1">
      <p className="text-[length:var(--type-dashboard-micro)] font-medium text-[var(--app-text-muted)]">
        You
      </p>
      <div className="rounded-2xl rounded-tr-sm border border-[color-mix(in_srgb,var(--app-border-solid)_54%,transparent)] bg-[color-mix(in_srgb,var(--app-surface-primary)_94%,var(--app-course-sage))] px-4 py-3 text-[length:var(--type-dashboard-body)] leading-relaxed text-[var(--app-text-primary)] shadow-[0_1px_0_rgba(255,255,255,0.72)_inset,0_8px_24px_rgba(37,50,58,0.05)]">
        <p className="whitespace-pre-wrap">{message.payload.text}</p>
      </div>
    </div>
  );
};
