import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type OverviewDetailRowProps = {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
};

export const OverviewDetailRow = ({
  icon: Icon,
  label,
  children,
}: OverviewDetailRowProps) => (
  <div className="grid grid-cols-[auto_auto_minmax(0,1fr)] items-start gap-x-2 text-xs">
    <Icon
      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
      aria-hidden
    />
    <span className="shrink-0 text-muted-foreground">{label}</span>
    <div className="min-w-0 text-left">{children}</div>
  </div>
);
