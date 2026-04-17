import { ChatArea } from "@/features/chat/components/ChatArea";
import { ChatInput } from "@/features/chat/components/ChatInput";
import { ChatProvider } from "@/features/chat/context";

export const Chat = () => {
  return (
    <ChatProvider>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--app-hairline)] bg-[radial-gradient(118%_88%_at_50%_-6%,color-mix(in_srgb,var(--app-course-sage)_5%,transparent)_0%,transparent_46%),linear-gradient(180deg,color-mix(in_srgb,var(--app-surface-primary)_97%,var(--app-course-fog))_0%,var(--app-surface-primary)_100%)] shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_8px_28px_rgba(37,50,58,0.07)]">
          <header className="relative shrink-0 border-b border-[color-mix(in_srgb,var(--app-border-solid)_48%,transparent)] px-5 pt-4 pb-3">
            <p className="text-[length:var(--type-dashboard-micro)] font-medium uppercase tracking-[0.18em] text-[var(--app-text-muted)]">
              Workspace tutor
            </p>
            <h1 className="mt-1 text-[length:var(--font-size-2xl)] font-semibold tracking-[-0.03em] text-[var(--app-text-primary)]">
              Ask HydroWise
            </h1>
          </header>
          <ChatArea />
          <div className="shrink-0 px-4 pb-4 pt-3">
            <ChatInput />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};
