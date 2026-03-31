import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardWorkspaceShellProps = {
  courseTabs: ReactNode;
  title: string;
  kicker?: string | null;
  headerRight: ReactNode;
  children: ReactNode;
  className?: string;
};

export const DashboardWorkspaceShell = ({
  courseTabs,
  title,
  kicker,
  headerRight,
  children,
  className,
}: DashboardWorkspaceShellProps) => {
  return (
    <div
      className={cn(
        "mt-2.5 flex min-h-0 flex-col overflow-hidden rounded-[11px] border border-border bg-card shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_16px_42px_rgba(37,50,58,0.06),0_5px_16px_rgba(37,50,58,0.036)]",
        className,
      )}
    >
      <nav
        className="shrink-0 border-b border-border/80 bg-gradient-to-b from-muted/35 to-muted/20 px-4 pb-0 pt-[14px]"
        aria-label="Courses"
      >
        {courseTabs}
      </nav>
      <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-card via-card to-background/25">
        <header className="shrink-0 border-b border-border/50 bg-gradient-to-b from-card to-muted/15 px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              {kicker ? (
                <p className="mb-1 truncate text-[11px] font-semibold tracking-wide text-muted-foreground">
                  {kicker}
                </p>
              ) : null}
              <p className="truncate text-lg font-bold leading-tight tracking-tight text-foreground">
                {title}
              </p>
            </div>
            {headerRight}
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-auto p-3.5">{children}</div>
      </div>
    </div>
  );
};
