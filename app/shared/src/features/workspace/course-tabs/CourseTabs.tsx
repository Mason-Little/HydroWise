import type { CSSProperties } from "react";
import { CourseTab, type CourseTabItem } from "./CourseTab";
import { buildCourseRailWash } from "./courseTheme";

type CourseTabsProps = {
  tabs: readonly CourseTabItem[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  tabsMode?: "always" | "hover-reveal";
  isExpanded?: boolean;
};

export const CourseTabs = ({
  tabs,
  activeTabId,
  onSelectTab,
  ariaLabel = "Courses",
  className,
  style,
  tabsMode = "always",
  isExpanded = true,
}: CourseTabsProps) => {
  const railStyle: CSSProperties = {
    background: buildCourseRailWash(tabs.map((tab) => tab.code)),
    ...style,
  };
  const isHoverRevealCollapsed = tabsMode === "hover-reveal" && !isExpanded;

  return (
    <nav
      aria-label={ariaLabel}
      className={
        className ??
        `relative flex-shrink-0 overflow-x-auto overflow-y-hidden border-b border-[var(--app-hairline)] bg-[var(--course-rail-wash)] scrollbar-thin [scrollbar-color:color-mix(in_srgb,var(--app-border-solid)_65%,transparent)_transparent] [overscroll-behavior-x:contain] ${isHoverRevealCollapsed ? "py-0" : ""}`
      }
      style={railStyle}
    >
      <div
        role="tablist"
        className={
          isHoverRevealCollapsed
            ? "flex w-full min-w-0 flex-row flex-nowrap items-end gap-3 px-4 pt-1 pb-0"
            : "flex w-full min-w-0 flex-row flex-nowrap items-stretch gap-3 px-4 pt-[14px] pb-0"
        }
      >
        {tabs.map((tab) => (
          <CourseTab
            key={tab.id}
            tab={tab}
            isActive={activeTabId === tab.id}
            onSelect={() => onSelectTab(tab.id)}
            tabsMode={tabsMode}
            isExpanded={isExpanded}
          />
        ))}
      </div>
    </nav>
  );
};
