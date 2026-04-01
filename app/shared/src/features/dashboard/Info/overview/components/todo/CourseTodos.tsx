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
      className="app-overview-rail-panel h-full min-h-0 overflow-hidden"
      aria-labelledby="overview-tasks-heading"
    >
      <header className="app-overview-rail-panel__head app-overview-tasks__head px-3.5 pt-3 pb-2.5">
        <div className="flex min-w-0 items-start justify-between gap-2.5">
          <div className="min-w-0">
            <h2
              id="overview-tasks-heading"
              className="app-overview-tasks__title"
            >
              Tasks
            </h2>
            <p className="app-overview-tasks__meta">{tasksMeta}</p>
          </div>
          {!composing ? (
            <button
              type="button"
              className="app-overview-tasks__add"
              onClick={() => setComposingOpen(true)}
            >
              <span className="app-overview-tasks__add-icon" aria-hidden>
                +
              </span>
              <span className="app-overview-tasks__add-label">Add</span>
            </button>
          ) : null}
        </div>
      </header>

      <div className="app-overview-tasks__scroll min-h-0 flex-1 overflow-y-auto px-3.5 pb-2">
        {showEmptyHint ? (
          <p className="app-overview-tasks__empty">
            Nothing here yet — add a task when something comes to mind.
          </p>
        ) : null}

        {open.length > 0 ? (
          <ul className="app-overview-tasks__list">
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
          <p className="app-overview-tasks__open-zero">
            No open tasks — all caught up for now.
          </p>
        ) : null}

        {done.length > 0 ? (
          <div className="app-overview-tasks__completed-wrap">
            <p className="app-overview-tasks__completed-label">Completed</p>
            <ul className="app-overview-tasks__list app-overview-tasks__list--done">
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
        <div className="app-overview-rail-panel__foot px-3 py-2 pb-2.5">
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
