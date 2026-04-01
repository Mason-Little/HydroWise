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
    <div className={cn("app-overview-tasks__row", isDone && "is-done")}>
      <input
        type="checkbox"
        checked={isDone}
        onChange={onToggle}
        className="app-overview-tasks__check"
        aria-label={isDone ? "Mark incomplete" : "Mark complete"}
      />
      <div className="app-overview-tasks__body">
        <p
          className={cn(
            "app-overview-tasks__text",
            isDone && "app-overview-tasks__text--done",
          )}
        >
          {todo.text}
        </p>
        {due ? (
          <span
            className={cn(
              "app-overview-tasks__due",
              isDone && "app-overview-tasks__due--done",
            )}
            title={due.row}
          >
            {due.pill}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        className="app-overview-tasks__remove"
        onClick={onRemove}
        aria-label="Remove task"
      >
        <XIcon className="size-2.5" strokeWidth={2.25} />
      </button>
    </div>
  );
};
