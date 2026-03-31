import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardWorkspaceShellProps = {
  courseTabs: ReactNode;
  header: ReactNode;
  children: ReactNode;
  className?: string;
};

export const DashboardWorkspaceShell = ({
  courseTabs,
  header,
  children,
  className,
}: DashboardWorkspaceShellProps) => (
  <div
    className={cn(
      "app-workspace-shell mt-2.5 flex min-h-0 flex-1 flex-col overflow-hidden",
      className,
    )}
  >
    <nav className="app-course-rail shrink-0" aria-label="Courses">
      {courseTabs}
    </nav>
    <div className="app-workspace-shell__canvas flex min-h-0 flex-1 flex-col">
      <header className="app-workspace-shell__header shrink-0 px-5 py-3">
        {header}
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-3.5">{children}</div>
    </div>
  </div>
);
