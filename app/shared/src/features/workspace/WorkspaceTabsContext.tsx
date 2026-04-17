import { createContext, useContext } from "react";
import type { WorkspaceTabsMode } from "@/features/workspace/WorkspaceShell";

type WorkspaceTabsContextValue = {
  tabsMode: WorkspaceTabsMode;
  isExpanded: boolean;
};

const WorkspaceTabsContext = createContext<WorkspaceTabsContextValue | null>(
  null,
);

export const WorkspaceTabsProvider = WorkspaceTabsContext.Provider;

export const useWorkspaceTabs = (): WorkspaceTabsContextValue => {
  const value = useContext(WorkspaceTabsContext);
  if (value === null) {
    throw new Error(
      "useWorkspaceTabs must be used within WorkspaceTabsProvider",
    );
  }

  return value;
};
