import { useState } from "react";
import { useDashboardContext } from "@/features/dashboard/Dashboard";
import { TodoComposer } from "@/features/dashboard/Info/overview/components/todo/TodoComposer";
import { TodoRow } from "@/features/dashboard/Info/overview/components/todo/TodoRow";
import { useUpdateCourseTodos } from "@/features/dashboard/Info/overview/components/todo/useUpdateCourseTodos";

type CourseTodosProps = {
  onComposingChange?: (composing: boolean) => void;
};

const TASK_LIST_CLASS_NAME =
  "divide-y divide-[color-mix(in_srgb,var(--hairline)_60%,transparent)]";

export const CourseTodos = ({ onComposingChange }: CourseTodosProps) => {
  const { activeCourse } = useDashboardContext();
  const [composing, setComposing] = useState(false);

  const courseId = activeCourse?.id ?? "";
  const { mutate, isPending } = useUpdateCourseTodos(courseId);

  const setComposingOpen = (open: boolean) => {
    setComposing(open);
    onComposingChange?.(open);
  };

  if (!activeCourse) return null;

  const todos = activeCourse.courseTodos ?? [];
  const open = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done);

  const toggleTodo = (id: string) =>
    mutate(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const removeTodo = (id: string) => mutate(todos.filter((t) => t.id !== id));

  const addTask = (text: string, dueAt: string | null) => {
    mutate([...todos, { id: crypto.randomUUID(), text, done: false, dueAt }]);
    setComposingOpen(false);
  };

  return (
    <section
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-[13px] border border-border/30 bg-[color-mix(in_srgb,var(--surface)_93%,var(--bg))] shadow-[0_1px_0_color-mix(in_srgb,var(--surface)_78%,transparent)_inset,0_4px_14px_rgba(37,50,58,0.022)]"
      aria-labelledby="overview-tasks-heading"
    >
      <header className="shrink-0 border-border/28 border-b px-3.5 pt-[11px] pb-[9px]">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <h2
            id="overview-tasks-heading"
            className="font-display min-w-0 text-[length:var(--type-dashboard-body)] leading-[1.15] font-bold tracking-[-0.025em] text-[var(--text-primary)]"
          >
            Tasks{" "}
            <span className="text-[length:var(--type-dashboard-micro)] font-semibold tracking-normal text-[#5d6f79] tabular-nums">
              · {open.length} open
            </span>
          </h2>
          {!composing ? (
            <button
              type="button"
              className="inline-flex shrink-0 items-baseline gap-0.5 rounded-md border border-dashed border-border/45 bg-[color-mix(in_srgb,var(--bg)_32%,transparent)] px-2 py-1 text-[var(--text-tertiary)] transition-colors hover:border-primary/28 hover:text-[var(--text-primary)]"
              onClick={() => setComposingOpen(true)}
            >
              <span className="translate-y-px text-[11px] leading-none font-bold">
                +
              </span>
              <span className="text-[10px] leading-none font-bold tracking-[0.04em]">
                Add
              </span>
            </button>
          ) : null}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className={TASK_LIST_CLASS_NAME}>
          {open.map((todo) => (
            <li key={todo.id}>
              <TodoRow
                todo={todo}
                onToggle={() => toggleTodo(todo.id)}
                onRemove={() => removeTodo(todo.id)}
              />
            </li>
          ))}
        </ul>

        {done.length > 0 ? (
          <div className="mt-2.5 border-border/22 border-t pt-2">
            <p className="mb-1.5 text-[length:var(--type-dashboard-micro)] leading-none font-semibold tracking-normal text-[#5d6f79]">
              Completed
            </p>
            <ul className={TASK_LIST_CLASS_NAME}>
              {done.map((todo) => (
                <li key={todo.id}>
                  <TodoRow
                    todo={todo}
                    onToggle={() => toggleTodo(todo.id)}
                    onRemove={() => removeTodo(todo.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {composing ? (
        <div className="shrink-0 border-border/22 border-t bg-[color-mix(in_srgb,var(--bg)_22%,var(--surface))] px-3 py-2 pb-2.5">
          <TodoComposer
            onSave={addTask}
            onCancel={() => setComposingOpen(false)}
            isSaving={isPending}
          />
        </div>
      ) : null}
    </section>
  );
};
