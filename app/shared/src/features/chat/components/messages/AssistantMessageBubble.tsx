import type { ReactNode } from "react";

type AssistantMessageBubbleProps = {
  text: string;
  children?: ReactNode;
};

export const AssistantMessageBubble = ({
  text,
  children,
}: AssistantMessageBubbleProps) => (
  <div className="border-border bg-background mr-auto max-w-[85%] rounded-2xl border px-3 py-2 text-sm">
    <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-wide uppercase">
      HydroWise
    </p>
    <p className="whitespace-pre-wrap">{text}</p>
    {children}
  </div>
);
