import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardWorkspaceShellProps = {
  courseTabs: ReactNode;
  header: ReactNode;
  children: ReactNode;
  className?: string;
};

const workspaceShellRootClassName =
  "app-workspace-shell mt-2 flex min-h-0 flex-1 flex-col overflow-hidden";

export const DashboardWorkspaceShell = ({
  courseTabs,
  header,
  children,
  className,
}: DashboardWorkspaceShellProps): ReactElement => (
  <div className={cn(workspaceShellRootClassName, className)}>
    <nav className="app-course-rail shrink-0" aria-label="Courses">
      {courseTabs}
    </nav>
    <div className="app-workspace-shell__canvas flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="app-workspace-shell__header shrink-0">{header}</header>
      <div className="app-workspace-shell__body min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  </div>
);
