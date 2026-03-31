import { useState } from "react";
import { PillToggle } from "@/components/ui/pill-toggle";
import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { DashboardWorkspaceShell } from "@/features/dashboard/DashboardWorkspaceShell";
import { Material } from "@/features/dashboard/Info/material/Material";
import { Overview } from "@/features/dashboard/Info/overview/Overview";
import { CourseSelector } from "@/features/dashboard/selection/course-selector/CourseSelector";

export const Info = () => {
  const { activeCourse } = useDashboardContext();
  const [view, setView] = useState<"overview" | "material">("overview");

  return (
    <DashboardWorkspaceShell
      courseTabs={<CourseSelector />}
      kicker={activeCourse?.courseCode}
      title={activeCourse?.courseName ?? "—"}
      headerRight={
        <div className="w-36 shrink-0">
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
    >
      {view === "overview" ? <Overview /> : <Material />}
    </DashboardWorkspaceShell>
  );
};
