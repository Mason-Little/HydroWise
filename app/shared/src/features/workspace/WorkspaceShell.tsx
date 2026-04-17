import { motion } from "motion/react";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export type WorkspaceTabsMode = "always" | "hover-reveal";

type WorkspaceShellProps = {
  tabs?: ReactNode;
  header: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  tabsMode?: WorkspaceTabsMode;
};

const workspaceShellRootClassName =
  "app-workspace-shell mt-2 flex min-h-0 flex-1 flex-col";

const HOVER_INTENT_DELAY_MS = 80;
const COLLAPSED_TABS_HEIGHT_PX = 44;
const EXPANDED_TABS_HEIGHT_PX = 80;

const useHoverRevealAlwaysOpen = () => {
  const [alwaysOpen, setAlwaysOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)",
    );

    const updateAlwaysOpen = () => setAlwaysOpen(mediaQuery.matches);

    updateAlwaysOpen();
    mediaQuery.addEventListener("change", updateAlwaysOpen);

    return () => mediaQuery.removeEventListener("change", updateAlwaysOpen);
  }, []);

  return alwaysOpen;
};

export const WorkspaceShell = ({
  tabs,
  header,
  children,
  className,
  style,
  tabsMode = "always",
}: WorkspaceShellProps) => {
  const alwaysOpen = useHoverRevealAlwaysOpen();
  const [isTabsExpanded, setIsTabsExpanded] = useState(tabsMode === "always");
  const openTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setIsTabsExpanded(tabsMode === "always" || alwaysOpen);
  }, [alwaysOpen, tabsMode]);

  useEffect(() => {
    return () => {
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  const clearOpenTimer = () => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  };

  const openTabsImmediately = () => {
    clearOpenTimer();
    setIsTabsExpanded(true);
  };

  const closeTabs = () => {
    clearOpenTimer();
    if (tabsMode === "hover-reveal" && !alwaysOpen) {
      setIsTabsExpanded(false);
    }
  };

  const scheduleOpenTabs = () => {
    if (tabsMode !== "hover-reveal" || alwaysOpen) {
      return;
    }

    clearOpenTimer();
    openTimerRef.current = window.setTimeout(() => {
      setIsTabsExpanded(true);
      openTimerRef.current = null;
    }, HOVER_INTENT_DELAY_MS);
  };

  const tabsContainerClassName =
    "app-workspace-shell__tabs shrink-0 overflow-hidden";
  const tabsWrapper = (
    <motion.div
      className={tabsContainerClassName}
      data-tabs-mode={tabsMode}
      data-expanded={isTabsExpanded ? "true" : "false"}
      onPointerEnter={scheduleOpenTabs}
      onPointerLeave={closeTabs}
      onFocusCapture={openTabsImmediately}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          closeTabs();
        }
      }}
      animate={
        tabsMode === "hover-reveal"
          ? {
              height: isTabsExpanded
                ? EXPANDED_TABS_HEIGHT_PX
                : COLLAPSED_TABS_HEIGHT_PX,
            }
          : { height: "auto" }
      }
      initial={false}
      transition={
        tabsMode === "hover-reveal"
          ? { duration: 0.18, ease: "easeOut" }
          : undefined
      }
      style={tabsMode === "hover-reveal" ? { overflow: "hidden" } : undefined}
    >
      {tabs}
    </motion.div>
  );

  return (
    <div className={cn(workspaceShellRootClassName, className)} style={style}>
      {tabsMode === "always" ? (
        <div className={tabsContainerClassName} data-tabs-mode={tabsMode}>
          {tabs}
        </div>
      ) : (
        tabsWrapper
      )}
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
