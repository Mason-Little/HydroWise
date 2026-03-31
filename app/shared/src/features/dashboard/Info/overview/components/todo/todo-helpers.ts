import { format, parse, parseISO } from "date-fns";

export const formatDueStorage = (d: Date) => format(d, "yyyy-MM-dd");

export const formatDueRowLabel = (dueAt: string): string => {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(dueAt)
    ? parse(dueAt, "yyyy-MM-dd", new Date())
    : parseISO(dueAt);
  return `Due ${format(d, "EEE, MMM d")}`;
};
