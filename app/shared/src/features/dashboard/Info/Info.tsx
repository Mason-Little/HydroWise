import { useState } from "react";
import { PillToggle } from "@/components/ui/pill-toggle";
import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { Material } from "@/features/dashboard/Info/material/Material";
import { Overview } from "@/features/dashboard/Info/overview/Overview";

export const Info = () => {
  const { activeCourse } = useDashboardContext();
  const [view, setView] = useState<"overview" | "material">("overview");

  return (
    <div className="mt-2.5 rounded-md border border-border bg-card p-3.5">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">
            {activeCourse?.courseCode ?? "—"}
          </p>
          <p className="truncate text-sm font-semibold">
            {activeCourse?.courseName ?? "—"}
          </p>
        </div>
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
      </div>
      {view === "overview" ? <Overview /> : <Material />}
    </div>
  );
};
