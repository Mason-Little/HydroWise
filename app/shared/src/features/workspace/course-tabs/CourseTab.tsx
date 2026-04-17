import type { CSSProperties } from "react";
import { useWorkspaceTabs } from "@/features/workspace/WorkspaceTabsContext";

export type CourseTabItem = {
  id: string;
  code: string;
  name: string;
  style?: CSSProperties;
};

type CourseTabProps = {
  tab: CourseTabItem;
  isActive: boolean;
  onSelect: () => void;
};

export const CourseTab = ({ tab, isActive, onSelect }: CourseTabProps) => {
  const { tabsMode, isExpanded } = useWorkspaceTabs();
  const baseClassName =
    "touch-manipulation text-left [-webkit-tap-highlight-color:transparent] relative block w-full min-w-0 m-0 cursor-pointer rounded-t-[var(--radius-xl)] rounded-b-none border px-4 text-[length:var(--type-dashboard-body)] font-medium leading-tight transition-[color,background-color,box-shadow,border-color,transform,padding,min-height] duration-150 ease-out";
  const isHoverRevealCollapsed = tabsMode === "hover-reveal" && !isExpanded;
  const sizingClassName = isHoverRevealCollapsed
    ? "min-h-[40px] py-[6px]"
    : tabsMode === "hover-reveal"
      ? "min-h-[74px] py-[10px]"
      : "min-h-[72px] py-3";
  const inactiveClassName =
    "border-transparent bg-[var(--course-tab-bg)] text-[var(--course-tab-fg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_0_0_1px_color-mix(in_srgb,var(--course-tab-border)_92%,transparent),0_4px_14px_rgba(37,50,58,0.028)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_0_0_1px_color-mix(in_srgb,var(--course-tab-border)_94%,transparent),0_5px_18px_rgba(37,50,58,0.038)]";
  const activeClassName =
    "z-10 -mb-px cursor-default border border-[var(--course-tab-active-border)] border-b-transparent bg-[var(--course-tab-active-bg)] text-[var(--course-tab-active-fg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_0_0_var(--course-tab-active-bg)]";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-active={isActive ? "true" : "false"}
      onClick={onSelect}
      style={tab.style}
      className={
        isActive
          ? `${baseClassName} ${sizingClassName} ${activeClassName}`
          : `${baseClassName} ${sizingClassName} ${inactiveClassName}`
      }
    >
      <span
        className={
          isHoverRevealCollapsed
            ? "block translate-y-px text-[length:calc(var(--type-dashboard-body)+1px)] font-semibold tracking-[-0.02em] leading-none"
            : "block text-[length:calc(var(--type-dashboard-body)+1px)] font-semibold tracking-[-0.02em]"
        }
      >
        {tab.code}
      </span>
      <span
        className={
          isHoverRevealCollapsed
            ? "block max-h-0 overflow-hidden text-[length:var(--type-dashboard-topbar)] font-medium leading-snug text-current/90 opacity-0 transition-[max-height,margin-top,opacity] duration-[180ms]"
            : "mt-1 block max-w-full truncate overflow-hidden text-[length:var(--type-dashboard-topbar)] font-medium leading-snug text-current/90"
        }
      >
        {tab.name}
      </span>
    </button>
  );
};
