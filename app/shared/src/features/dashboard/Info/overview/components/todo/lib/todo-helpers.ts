import type { CourseTodoItem } from "@hydrowise/entities";

type InsertAfterResult = {
  newId: string;
  next: CourseTodoItem[];
};

export const newEmptyTodo = (): CourseTodoItem => ({
  id: crypto.randomUUID(),
  text: "",
  done: false,
});

/** Keep rows that have text or are checked (checked-but-empty still persists). */
export const normalizeTodosForPersist = (
  items: CourseTodoItem[],
): CourseTodoItem[] =>
  items.filter((row) => row.text.trim() !== "" || row.done);

/** UI always has at least one editable row. */
export const ensureEditableRows = (
  persisted: CourseTodoItem[],
): CourseTodoItem[] =>
  persisted.length === 0
    ? [newEmptyTodo()]
    : persisted.map((row) => ({ ...row }));

export const insertAfter = (
  items: CourseTodoItem[],
  index: number,
): InsertAfterResult => {
  const row = newEmptyTodo();
  return {
    next: [...items.slice(0, index + 1), row, ...items.slice(index + 1)],
    newId: row.id,
  };
};

export const removeAt = (
  items: CourseTodoItem[],
  index: number,
): CourseTodoItem[] => {
  const filtered = items.filter((_, i) => i !== index);
  return filtered.length === 0 ? [newEmptyTodo()] : filtered;
};

/** Id of the input that should receive focus after deleting `index`. */
export const focusTargetAfterRemove = (
  items: CourseTodoItem[],
  index: number,
): string | null => {
  if (index > 0) return items[index - 1]?.id ?? null;
  if (items.length > 1) return items[1]?.id ?? null;
  return null;
};
