import type { ReactNode } from "react";

type AssistantMessageBubbleProps = {
  text: string;
  children?: ReactNode;
};

export const AssistantMessageBubble = ({
  text,
  children,
}: AssistantMessageBubbleProps) => (
  <div className="flex max-w-[min(80%,72ch)] flex-col items-start gap-1">
    <p className="text-[length:var(--type-dashboard-micro)] font-medium text-[var(--app-text-muted)]">
      HydroWise
    </p>
    <div className="rounded-2xl rounded-tl-sm border border-[color-mix(in_srgb,var(--app-border-solid)_58%,transparent)] bg-[color-mix(in_srgb,var(--app-surface-primary)_92%,var(--app-course-fog))] px-4 py-3 text-[length:var(--type-dashboard-body)] leading-relaxed text-[var(--app-text-primary)] shadow-[0_1px_0_rgba(255,255,255,0.72)_inset,0_8px_24px_rgba(37,50,58,0.05)]">
      <p className="whitespace-pre-wrap">{text}</p>
    </div>
    {children != null ? children : null}
  </div>
);
