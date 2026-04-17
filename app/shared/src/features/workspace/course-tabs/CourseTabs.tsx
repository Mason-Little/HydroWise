import {
  CourseTab,
  type CourseTabItem,
} from "@/features/workspace/course-tabs/CourseTab";
import { buildCourseRailWash } from "@/features/workspace/course-tabs/courseTheme";
import { useWorkspaceTabs } from "@/features/workspace/WorkspaceTabsContext";

type CourseTabsProps = {
  tabs: readonly CourseTabItem[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
};

export const CourseTabs = ({
  tabs,
  activeTabId,
  onSelectTab,
}: CourseTabsProps) => {
  const { tabsMode, isExpanded } = useWorkspaceTabs();
  const railStyle = {
    background: buildCourseRailWash(tabs.map((tab) => tab.code)),
  };
  const isHoverRevealCollapsed = tabsMode === "hover-reveal" && !isExpanded;

  return (
    <nav
      aria-label="Courses"
      className={`relative flex-shrink-0 overflow-x-auto overflow-y-hidden border-b border-[var(--app-hairline)] bg-[var(--course-rail-wash)] scrollbar-thin [scrollbar-color:color-mix(in_srgb,var(--app-border-solid)_65%,transparent)_transparent] [overscroll-behavior-x:contain] ${isHoverRevealCollapsed ? "py-0" : ""}`}
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
          />
        ))}
      </div>
    </nav>
  );
};
