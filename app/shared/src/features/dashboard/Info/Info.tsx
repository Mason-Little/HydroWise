import { useState } from "react";
import { PillToggle } from "@/components/ui/pill-toggle";
import { CourseHeader } from "@/features/dashboard/CourseHeader";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { Material } from "@/features/dashboard/Info/material/Material";
import { Overview } from "@/features/dashboard/Info/overview/Overview";
import { WorkspaceCourseTabs } from "@/features/dashboard/selection/WorkspaceCourseTabs";
import { courseWorkspaceCssVariables } from "@/features/workspace/course-tabs/courseTheme";
import { WorkspaceShell } from "@/features/workspace/WorkspaceShell";

export const Info = () => {
  const [view, setView] = useState<"overview" | "material">("overview");
  const { activeCourse } = useDashboardContext();

  return (
    <WorkspaceShell
      tabs={<WorkspaceCourseTabs />}
      header={
        <CourseHeader
          headerRight={
            <div className="shrink-0">
              <PillToggle
                options={[
                  { value: "overview", label: "Overview" },
                  { value: "material", label: "Material" },
                ]}
                value={view}
                onValueChange={setView}
              />
            </div>
          }
        />
      }
      style={
        activeCourse
          ? courseWorkspaceCssVariables(activeCourse.courseCode)
          : undefined
      }
    >
      {view === "overview" ? <Overview /> : <Material />}
    </WorkspaceShell>
  );
};
