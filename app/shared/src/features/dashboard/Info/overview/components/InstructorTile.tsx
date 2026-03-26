import { useDashboardContext } from "@/features/dashboard/Dashboard";

export const InstructorTile = () => {
  const { activeCourse } = useDashboardContext();

  if (!activeCourse) return null;

  const {
    professorName,
    professorEmail,
    professorOffice,
    professorOfficeHours,
  } = activeCourse.professorInformation;

  return (
    <div className="rounded-md border border-[var(--border-solid)] bg-[var(--surface-alt)] px-3.5 py-3">
      <p className="mb-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        Instructor
      </p>
      <h2 className="mb-1.5 text-lg font-bold leading-tight">{professorName}</h2>
      <p className="text-xs text-muted-foreground">{professorEmail}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">Office: {professorOffice}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Hours:{" "}
        {professorOfficeHours ? (
          <span className="font-medium text-[var(--accent-warm)]">{professorOfficeHours}</span>
        ) : (
          <span className="font-medium text-muted-foreground">+ Add hours</span>
        )}
      </p>
    </div>
  );
};
