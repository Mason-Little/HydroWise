import type { CourseTodoItem } from "@hydrowise/entities";
import { XIcon } from "lucide-react";
import { getDueRowAndPillLabels } from "@/features/dashboard/Info/overview/components/todo/todo-helpers";
import { cn } from "@/lib/utils";

type TodoRowProps = {
  todo: CourseTodoItem;
  onToggle: () => void;
  onRemove: () => void;
};

export const TodoRow = ({ todo, onToggle, onRemove }: TodoRowProps) => {
  const isDone = todo.done;
  const due = todo.dueAt ? getDueRowAndPillLabels(todo.dueAt) : null;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--app-hairline)] bg-[var(--app-surface-primary)] px-3 py-2.5 shadow-[0_1px_0_rgba(255,255,255,0.72)_inset] transition-colors",
        isDone && "opacity-75",
      )}
    >
      <input
        type="checkbox"
        checked={isDone}
        onChange={onToggle}
        className="mt-0.5 size-4 rounded border-[var(--app-border-solid)] text-[var(--app-accent)] focus-visible:ring-1 focus-visible:ring-ring"
        aria-label={isDone ? "Mark incomplete" : "Mark complete"}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-[length:var(--type-dashboard-body)] leading-relaxed text-[var(--app-text-primary)]",
            isDone && "line-through text-[var(--app-text-muted)]",
          )}
        >
          {todo.text}
        </p>
        {due ? (
          <span
            className={cn(
              "mt-1 inline-flex rounded-full border border-[var(--app-hairline)] bg-[var(--app-surface-secondary)] px-2 py-0.5 text-[length:var(--type-dashboard-micro)] font-medium text-[var(--app-text-muted)]",
              isDone && "opacity-70",
            )}
            title={due.row}
          >
            {due.pill}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        className="rounded-full p-1 text-[var(--app-text-muted)] transition-colors hover:bg-[var(--app-surface-secondary)] hover:text-[var(--app-text-primary)]"
        onClick={onRemove}
        aria-label="Remove task"
      >
        <XIcon className="size-2.5" strokeWidth={2.25} />
      </button>
    </div>
  );
};
