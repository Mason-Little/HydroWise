import type { ReactElement, ReactNode } from "react";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { courseWorkspaceCssVariables } from "@/features/dashboard/selection/course-selector/courseTheme";
import { cn } from "@/lib/utils";

type DashboardWorkspaceShellProps = {
  courseTabs: ReactNode;
  header: ReactNode;
  children: ReactNode;
  className?: string;
};

const workspaceShellRootClassName =
  "app-workspace-shell mt-2 flex min-h-0 flex-1 flex-col";

export const DashboardWorkspaceShell = ({
  courseTabs,
  header,
  children,
  className,
}: DashboardWorkspaceShellProps): ReactElement => {
  const { activeCourse } = useDashboardContext();

  return (
    <div
      className={cn(workspaceShellRootClassName, className)}
      style={
        activeCourse
          ? courseWorkspaceCssVariables(activeCourse.courseCode)
          : undefined
      }
    >
      {courseTabs}
      <div className="app-workspace-shell__canvas flex min-h-0 flex-1 flex-col">
        <header className="app-workspace-shell__header shrink-0">
          {header}
        </header>
        <div className="app-workspace-shell__body min-h-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
