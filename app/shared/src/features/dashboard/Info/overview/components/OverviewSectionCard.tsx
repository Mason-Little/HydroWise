import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type OverviewSectionCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export const OverviewSectionCard = ({
  title,
  children,
  className,
}: OverviewSectionCardProps) => (
  <div
    className={cn(
      "rounded-md border border-[var(--border-solid)] px-3.5 py-3",
      className,
    )}
  >
    <p className="mb-2.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
      {title}
    </p>
    {children}
  </div>
);
