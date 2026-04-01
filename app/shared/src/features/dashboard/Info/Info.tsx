import { useState } from "react";
import { PillToggle } from "@/components/ui/pill-toggle";
import { CourseHeader } from "@/features/dashboard/CourseHeader";
import { DashboardWorkspaceShell } from "@/features/dashboard/DashboardWorkspaceShell";
import { Material } from "@/features/dashboard/Info/material/Material";
import { Overview } from "@/features/dashboard/Info/overview/Overview";
import { CourseSelector } from "@/features/dashboard/selection/course-selector/CourseSelector";

export const Info = () => {
  const [view, setView] = useState<"overview" | "material">("overview");

  return (
    <DashboardWorkspaceShell
      courseTabs={<CourseSelector />}
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
    >
      {view === "overview" ? <Overview /> : <Material />}
    </DashboardWorkspaceShell>
  );
};
