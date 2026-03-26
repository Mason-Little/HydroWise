import type { CourseRow } from "@/features/dashboard/Dashboard";
import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { EditableField } from "@/features/dashboard/Info/overview/components/EditableField";
import { useUpdateProfessorInformation } from "@/features/dashboard/Info/overview/components/instructor/hooks/useUpdateProfessorInformation";
import { OverviewSectionCard } from "@/features/dashboard/Info/overview/components/OverviewSectionCard";

export const InstructorTile = () => {
  const { activeCourse } = useDashboardContext();
  if (!activeCourse) return null;
  return <InstructorTileContent course={activeCourse} />;
};

const InstructorTileContent = ({ course }: { course: CourseRow }) => {
  const { mutate } = useUpdateProfessorInformation(course.id);

  const {
    professorName,
    professorEmail,
    professorOffice,
    professorOfficeHours,
  } = course.professorInformation;

  return (
    // TODO: Visual pass on this tile — spacing, hierarchy, and alignment with the rest of Overview
    // when we finish the Info UI polish.
    <OverviewSectionCard title="Instructor">
      <h2 className="mb-1.5 text-lg font-bold leading-tight">
        {professorName}
      </h2>
      <p className="text-xs text-muted-foreground">{professorEmail}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Office:{" "}
        <EditableField
          value={professorOffice}
          placeholder="Add office"
          onSave={(next) => mutate({ professorOffice: next })}
        />
      </p>
      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span>Hours:</span>
        <EditableField
          value={professorOfficeHours}
          placeholder="Add hours"
          onSave={(next) => mutate({ professorOfficeHours: next })}
        />
      </div>
    </OverviewSectionCard>
  );
};
