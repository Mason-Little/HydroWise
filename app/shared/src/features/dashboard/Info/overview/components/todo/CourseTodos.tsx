import type { CourseTodoItem } from "@hydrowise/entities";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CourseRow } from "@/features/dashboard/Dashboard";
import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { OverviewSectionCard } from "@/features/dashboard/Info/overview/components/OverviewSectionCard";
import { useUpdateCourseTodos } from "@/features/dashboard/Info/overview/components/todo/hooks/useUpdateCourseTodos";
import {
  ensureEditableRows,
  focusTargetAfterRemove,
  insertAfter,
  normalizeTodosForPersist,
  removeAt,
} from "@/features/dashboard/Info/overview/components/todo/lib/todo-helpers";
import { TodoRow } from "@/features/dashboard/Info/overview/components/todo/TodoRow";

type CourseTodosContentProps = {
  course: CourseRow;
};

const SAVE_DEBOUNCE_MS = 300;

const patchItemAt = (
  items: CourseTodoItem[],
  index: number,
  patch: Partial<CourseTodoItem>,
): CourseTodoItem[] => {
  const row = items[index];
  if (!row) return items;
  const next = [...items];
  next[index] = { ...row, ...patch };
  return next;
};

export const CourseTodos = () => {
  const { activeCourse } = useDashboardContext();
  if (!activeCourse) return null;
  return <CourseTodosContent key={activeCourse.id} course={activeCourse} />;
};

const CourseTodosContent = ({ course }: CourseTodosContentProps) => {
  const [items, setItems] = useState<CourseTodoItem[]>(() =>
    ensureEditableRows(course.courseTodos ?? []),
  );
  const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const { mutate } = useUpdateCourseTodos(course.id);

  const clearPendingFocus = useCallback(() => {
    setPendingFocusId(null);
  }, []);

  useEffect(() => {
    const toSave = normalizeTodosForPersist(items);
    const timeoutId = setTimeout(() => {
      mutate(toSave);
    }, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [items, mutate]);

  const updateText = useCallback((index: number, text: string) => {
    setItems((prev) => patchItemAt(prev, index, { text }));
  }, []);

  const toggleDone = useCallback((index: number) => {
    setItems((prev) => {
      const row = prev[index];
      if (!row) return prev;
      return patchItemAt(prev, index, { done: !row.done });
    });
  }, []);

  const insertRowBelow = useCallback((index: number) => {
    const { next, newId } = insertAfter(itemsRef.current, index);
    setItems(next);
    setPendingFocusId(newId);
  }, []);

  const removeRowAt = useCallback((index: number) => {
    const snapshot = itemsRef.current;
    const focusId = focusTargetAfterRemove(snapshot, index);
    setItems(removeAt(snapshot, index));
    if (focusId) setPendingFocusId(focusId);
  }, []);

  return (
    <OverviewSectionCard title="Course tasks">
      <p className="mb-2.5 text-xs text-muted-foreground">
        Tasks for this course. Press Enter for a new line.
      </p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, index) => (
          <TodoRow
            key={item.id}
            item={item}
            pendingFocusId={pendingFocusId}
            onFocusConsumed={clearPendingFocus}
            onTextChange={(text) => updateText(index, text)}
            onToggleDone={() => toggleDone(index)}
            onEnter={() => insertRowBelow(index)}
            onBackspaceEmpty={() => removeRowAt(index)}
            onRemove={() => removeRowAt(index)}
          />
        ))}
      </ul>
    </OverviewSectionCard>
  );
};
