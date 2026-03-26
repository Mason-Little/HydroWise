import type { CourseDetails } from "@hydrowise/entities";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenIcon,
  CalendarDaysIcon,
  CalendarRangeIcon,
  GraduationCapIcon,
  ListChecksIcon,
} from "lucide-react";
import { useMemo } from "react";
import type { CourseRow } from "@/features/dashboard/Dashboard";
import { useUpdateCourseDetails } from "@/features/dashboard/Info/overview/components/course-details/hooks/useUpdateCourseDetails";

const nullIfEmpty = (next: string | null) =>
  next === null || next.trim() === "" ? null : next.trim();

const creditsPatchFromInput = (
  next: string | null,
): Partial<CourseDetails> | null => {
  if (next === null || next.trim() === "") {
    return { credits: 0 };
  }
  const parsed = Number.parseInt(next, 10);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return { credits: parsed };
};

export type CourseDetailRow = {
  label: string;
  icon: LucideIcon;
  placeholder: string;
  value: (c: CourseRow) => string | null;
  onSave: (next: string | null) => void;
};

export const useCourseDetailRows = (courseId: string): CourseDetailRow[] => {
  const { mutate } = useUpdateCourseDetails(courseId);

  return useMemo(
    () => [
      {
        label: "Term",
        icon: CalendarRangeIcon,
        placeholder: "Add term",
        value: (c) => c.courseDetails.term,
        onSave: (next) => {
          mutate({ term: nullIfEmpty(next) });
        },
      },
      {
        label: "Schedule",
        icon: CalendarDaysIcon,
        placeholder: "Add schedule",
        value: (c) => c.courseDetails.schedule,
        onSave: (next) => {
          mutate({ schedule: nullIfEmpty(next) });
        },
      },
      {
        label: "Credits",
        icon: GraduationCapIcon,
        placeholder: "Add credits",
        value: (c) => String(c.courseDetails.credits),
        onSave: (next) => {
          const patch = creditsPatchFromInput(next);
          if (patch) mutate(patch);
        },
      },
      {
        label: "Prerequisites",
        icon: ListChecksIcon,
        placeholder: "Add prerequisites",
        value: (c) => c.courseDetails.prerequisites,
        onSave: (next) => {
          mutate({ prerequisites: nullIfEmpty(next) });
        },
      },
      {
        label: "Textbook",
        icon: BookOpenIcon,
        placeholder: "Add textbook",
        value: (c) => c.courseDetails.textbook,
        onSave: (next) => {
          mutate({ textbook: nullIfEmpty(next) });
        },
      },
    ],
    [mutate],
  );
};
