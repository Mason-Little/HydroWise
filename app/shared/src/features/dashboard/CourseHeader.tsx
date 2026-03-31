import type { ReactNode } from "react";
import type { CourseRow } from "@/features/dashboard/Dashboard";
import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { useUpdateProfessorInformation } from "@/features/dashboard/hooks/useUpdateProfessorInformation";
import { EditableField } from "@/features/dashboard/Info/overview/components/EditableField";

/** Design mock parity; no dedicated LMS URL field yet — extract from syllabus later on */
const ELEARN_HREF = "https://elearn.capu.ca";

type CourseHeaderProps = {
  headerRight: ReactNode;
};

const buildCourseMetaLine = (course: CourseRow): string | null => {
  const parts: string[] = [];
  const code = course.courseCode.trim();
  if (code) parts.push(code);
  const term = course.courseDetails.term?.trim();
  if (term) parts.push(term);
  const { credits } = course.courseDetails;
  if (credits > 0) {
    parts.push(`${credits} ${credits === 1 ? "credit" : "credits"}`);
  }
  return parts.length > 0 ? parts.join(" · ") : null;
};

type ProfessorContactBlockProps = {
  course: CourseRow;
};

const ProfessorContactBlock = ({ course }: ProfessorContactBlockProps) => {
  const { mutate } = useUpdateProfessorInformation(course.id);
  const {
    professorName,
    professorEmail,
    professorOffice,
    professorOfficeHours,
  } = course.professorInformation;

  return (
    <div className="mt-2.5 space-y-1 border-t border-border/40 pt-2.5">
      <p className="text-xs leading-snug text-muted-foreground">
        <span className="font-medium text-foreground/80">Instructor</span>{" "}
        {professorName.trim() || "—"}
        {professorEmail.trim() ? (
          <>
            <span className="select-none text-muted-foreground/45" aria-hidden>
              {" "}
              ·{" "}
            </span>
            <a
              href={`mailto:${professorEmail}`}
              className="font-medium text-foreground/80 underline-offset-2 hover:text-foreground hover:underline"
            >
              {professorEmail}
            </a>
          </>
        ) : null}
      </p>
      <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5 text-xs leading-snug text-muted-foreground">
        <span className="font-medium text-foreground/80">Office</span>
        <EditableField
          value={professorOffice}
          placeholder="Add office"
          onSave={(next) => mutate({ professorOffice: next })}
        />
        <span className="select-none text-muted-foreground/45" aria-hidden>
          ·
        </span>
        <span className="font-medium text-foreground/80">Office hours</span>
        <EditableField
          value={professorOfficeHours}
          placeholder="Add hours"
          onSave={(next) => mutate({ professorOfficeHours: next })}
        />
        <span className="select-none text-muted-foreground/45" aria-hidden>
          ·
        </span>
        <a
          href={ELEARN_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground/80 underline-offset-2 hover:text-foreground hover:underline"
        >
          eLearn
        </a>
      </div>
    </div>
  );
};

export const CourseHeader = ({ headerRight }: CourseHeaderProps) => {
  const { activeCourse } = useDashboardContext();
  const metaLine = activeCourse ? buildCourseMetaLine(activeCourse) : null;
  const title = activeCourse?.courseName ?? "—";

  return (
    <div className="space-y-1.5">
      {metaLine ? (
        <p className="truncate text-[11px] font-semibold tracking-wide text-muted-foreground">
          {metaLine}
        </p>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xl font-bold leading-tight tracking-tight text-foreground">
            {title}
          </p>
        </div>
        {headerRight}
      </div>
      {activeCourse ? <ProfessorContactBlock course={activeCourse} /> : null}
    </div>
  );
};
