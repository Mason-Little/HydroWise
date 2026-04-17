import type { CSSProperties } from "react";

export type CourseTabItem = {
  id: string;
  code: string;
  name: string;
  style?: CSSProperties;
};

type CourseTabProps = {
  tab: CourseTabItem;
  isActive?: boolean;
  onSelect?: () => void;
};

export const CourseTab = ({ tab, isActive, onSelect }: CourseTabProps) => {
  const active = Boolean(isActive);

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-active={active ? "true" : "false"}
      onClick={onSelect}
      style={tab.style}
      className="app-course-tab touch-manipulation text-left [-webkit-tap-highlight-color:transparent]"
    >
      <span className="app-course-tab__code">{tab.code}</span>
      <span className="app-course-tab__name">{tab.name}</span>
    </button>
  );
};
