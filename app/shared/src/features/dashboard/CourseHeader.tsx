import type { ReactNode } from "react";
import type { CourseRow } from "@/features/dashboard/dashboard-context";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
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
    <div className="space-y-[3px]">
      <p className="text-[12px] leading-[1.35] text-[var(--app-text-muted)]">
        <span className="font-semibold text-[var(--app-text-primary)]">
          Instructor
        </span>{" "}
        <span className="font-[450] text-[color-mix(in_srgb,var(--app-text-muted)_88%,var(--app-text-primary))]">
          {professorName.trim() || "—"}
        </span>
        {professorEmail.trim() ? (
          <>
            <span
              className="select-none text-[color-mix(in_srgb,var(--app-text-muted)_45%,transparent)]"
              aria-hidden
            >
              {" "}
              ·{" "}
            </span>
            <a
              href={`mailto:${professorEmail}`}
              className="font-medium text-[var(--app-accent-strong)] no-underline underline-offset-2 hover:underline"
            >
              {professorEmail}
            </a>
          </>
        ) : null}
      </p>
      <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5 text-[12px] leading-[1.35] text-[var(--app-text-muted)]">
        <span className="font-semibold text-[var(--app-text-primary)]">
          Office
        </span>
        <EditableField
          value={professorOffice}
          placeholder="Add office"
          className="!text-[12px] font-[450] text-[color-mix(in_srgb,var(--app-text-muted)_88%,var(--app-text-primary))]"
          onSave={(next) => mutate({ professorOffice: next })}
        />
        <span
          className="mx-[3px] select-none text-[color-mix(in_srgb,var(--app-text-muted)_45%,transparent)] font-normal"
          aria-hidden
        >
          ·
        </span>
        <span className="font-semibold text-[var(--app-text-primary)]">
          Office hours
        </span>
        <EditableField
          value={professorOfficeHours}
          placeholder="Add hours"
          className="!text-[12px] font-[450] text-[color-mix(in_srgb,var(--app-text-muted)_88%,var(--app-text-primary))]"
          onSave={(next) => mutate({ professorOfficeHours: next })}
        />
        <span
          className="mx-[3px] select-none text-[color-mix(in_srgb,var(--app-text-muted)_45%,transparent)] font-normal"
          aria-hidden
        >
          ·
        </span>
        <a
          href={ELEARN_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--app-accent-strong)] no-underline underline-offset-2 hover:underline"
        >
          eLearn
        </a>
      </div>
    </div>
  );
};

export const CourseHeader = ({ headerRight }: CourseHeaderProps) => {
  const { activeCourse } = useDashboardContext();
  const metaLine = buildCourseMetaLine(activeCourse);

  return (
    <div className="space-y-1">
      {metaLine ? (
        <p className="truncate text-[length:var(--type-dashboard-micro)] font-semibold tracking-[0.01em] text-[#5a6f68]">
          {metaLine}
        </p>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display truncate text-[clamp(1.5rem,2.1vw,2.05rem)] font-bold leading-[1.08] tracking-[-0.04em] text-foreground">
            {activeCourse.courseName}
          </p>
        </div>
        {headerRight}
      </div>
      <div className="mt-2 box-border min-h-[3rem] min-w-0 border-t border-[color-mix(in_srgb,var(--app-border-solid)_40%,transparent)] pt-2">
        <ProfessorContactBlock course={activeCourse} />
      </div>
    </div>
  );
};
