import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ToolbarCommandSectionHeaderProps = {
  id: string;
  className: string;
  children: ReactNode;
};

export function ToolbarCommandSectionHeader({
  id,
  className,
  children,
}: ToolbarCommandSectionHeaderProps): ReactElement {
  return (
    <div
      id={id}
      className={cn(
        "px-[14px] pb-1.5 text-[11px] font-medium tracking-wide text-[var(--app-text-muted)] uppercase",
        className,
      )}
    >
      {children}
    </div>
  );
}
