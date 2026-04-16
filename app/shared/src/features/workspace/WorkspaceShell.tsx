import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type WorkspaceShellProps = {
  tabs?: ReactNode;
  header: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const workspaceShellRootClassName =
  "app-workspace-shell mt-2 flex min-h-0 flex-1 flex-col";

export const WorkspaceShell = ({
  tabs,
  header,
  children,
  className,
  style,
}: WorkspaceShellProps) => {
  return (
    <div className={cn(workspaceShellRootClassName, className)} style={style}>
      {tabs}
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
