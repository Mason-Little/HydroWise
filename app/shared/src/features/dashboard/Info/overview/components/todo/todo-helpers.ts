import { format, parse, parseISO } from "date-fns";

const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const parseDueAt = (dueAt: string): Date =>
  ISO_DATE_ONLY.test(dueAt)
    ? parse(dueAt, "yyyy-MM-dd", new Date())
    : parseISO(dueAt);

/** Row label + compact pill label from one due string (single parse). */
export const getDueRowAndPillLabels = (
  dueAt: string,
): { row: string; pill: string } => {
  const d = parseDueAt(dueAt);
  return {
    row: `Due ${format(d, "EEE, MMM d")}`,
    pill: format(d, "MMM d"),
  };
};

export const formatDueStorage = (d: Date) => format(d, "yyyy-MM-dd");

export const formatDueRowLabel = (dueAt: string): string =>
  getDueRowAndPillLabels(dueAt).row;

/** Compact date for the small due pill in the task row (accessibility: pair with full label). */
export const formatDuePillLabel = (dueAt: string): string =>
  getDueRowAndPillLabels(dueAt).pill;
