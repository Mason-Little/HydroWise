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
};

export const CourseTabs = ({
  tabs,
  activeTabId,
  onSelectTab,
  ariaLabel = "Courses",
  className,
  style,
}: CourseTabsProps) => {
  const railStyle: CSSProperties = {
    background: buildCourseRailWash(tabs.map((tab) => tab.code)),
    ...style,
  };

  return (
    <nav
      className={className ?? "app-course-rail"}
      aria-label={ariaLabel}
      style={railStyle}
    >
      <div role="tablist" className="app-course-rail__tablist">
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
