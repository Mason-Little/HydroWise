import { useState } from "react";
import { useDashboardContext } from "@/features/dashboard/dashboard-context";
import { TodoComposer } from "@/features/dashboard/Info/overview/components/todo/TodoComposer";
import { TodoRow } from "@/features/dashboard/Info/overview/components/todo/TodoRow";
import { useUpdateCourseTodos } from "@/features/dashboard/Info/overview/components/todo/useUpdateCourseTodos";

type CourseTodosProps = {
  onComposingChange?: (composing: boolean) => void;
};

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
  const total = todos.length;
  const showEmptyHint = total === 0 && !composing;

  const toggleTodo = (id: string) =>
    mutate(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const removeTodo = (id: string) => mutate(todos.filter((t) => t.id !== id));

  const addTask = (text: string, dueAt: string | null) => {
    mutate([...todos, { id: crypto.randomUUID(), text, done: false, dueAt }]);
    setComposingOpen(false);
  };

  const tasksMeta =
    done.length > 0
      ? `${open.length} open · ${done.length} done`
      : `${open.length} open`;

  return (
    <section
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--app-hairline)] bg-[var(--app-surface-primary)] shadow-[0_1px_0_rgba(255,255,255,0.72)_inset,0_8px_24px_rgba(37,50,58,0.05)]"
      aria-labelledby="overview-tasks-heading"
    >
      <header className="shrink-0 border-b border-[var(--app-hairline)] px-3.5 pt-3 pb-2.5">
        <div className="flex min-w-0 items-start justify-between gap-2.5">
          <div className="min-w-0">
            <h2
              id="overview-tasks-heading"
              className="text-[length:var(--type-dashboard-label)] font-semibold tracking-[-0.02em] text-[var(--app-text-primary)]"
            >
              Tasks
            </h2>
            <p className="mt-0.5 text-[length:var(--type-dashboard-micro)] text-[var(--app-text-muted)]">
              {tasksMeta}
            </p>
          </div>
          {!composing ? (
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-[var(--app-hairline)] bg-[var(--app-surface-secondary)] px-2.5 py-1 text-[length:var(--type-dashboard-micro)] font-medium text-[var(--app-text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
              onClick={() => setComposingOpen(true)}
            >
              <span aria-hidden>+</span>
              <span>Add</span>
            </button>
          ) : null}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3.5 pb-2">
        {showEmptyHint ? (
          <p className="py-3 text-[length:var(--type-dashboard-body)] leading-relaxed text-[var(--app-text-muted)]">
            Nothing here yet — add a task when something comes to mind.
          </p>
        ) : null}

        {open.length > 0 ? (
          <ul className="grid gap-2">
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
        ) : null}

        {open.length === 0 && done.length > 0 ? (
          <p className="py-3 text-[length:var(--type-dashboard-body)] text-[var(--app-text-muted)]">
            No open tasks — all caught up for now.
          </p>
        ) : null}

        {done.length > 0 ? (
          <div className="mt-4">
            <p className="mb-2 text-[length:var(--type-dashboard-micro)] font-medium uppercase tracking-[0.16em] text-[var(--app-text-muted)]">
              Completed
            </p>
            <ul className="grid gap-2">
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
        <div className="shrink-0 border-t border-[var(--app-hairline)] px-3 py-2 pb-2.5">
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
