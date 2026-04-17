import { motion } from "motion/react";
import {
  type CSSProperties,
  cloneElement,
  isValidElement,
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
  "relative mt-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--app-hairline)] bg-[linear-gradient(168deg,color-mix(in_srgb,var(--app-surface-primary)_92%,#f0efed)_0%,color-mix(in_srgb,var(--app-surface-primary)_97%,#f5f4f2)_40%,color-mix(in_srgb,var(--app-surface-primary)_94%,var(--app-workspace-bg))_100%)] font-sans text-[length:var(--type-dashboard-body)] text-[var(--app-text-primary)] shadow-[0_1px_0_color-mix(in_srgb,var(--app-surface-primary)_85%,transparent)_inset,0_16px_42px_rgba(37,50,58,0.06),0_5px_16px_rgba(37,50,58,0.036)]";

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

  const renderedTabs =
    tabs != null && isValidElement(tabs)
      ? cloneElement(tabs, {
          tabsMode,
          isExpanded: isTabsExpanded,
        })
      : tabs;

  const tabsContainerClassName =
    "group/workspace-tabs shrink-0 overflow-hidden";
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
      {renderedTabs}
    </motion.div>
  );

  return (
    <div className={cn(workspaceShellRootClassName, className)} style={style}>
      {tabsMode === "always" ? (
        <div className={tabsContainerClassName} data-tabs-mode={tabsMode}>
          {renderedTabs}
        </div>
      ) : (
        tabsWrapper
      )}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <header className="shrink-0 px-5 pt-3 pb-2.5">{header}</header>
        <div className="min-h-0 flex-1 p-3.5">{children}</div>
      </div>
    </div>
  );
};
