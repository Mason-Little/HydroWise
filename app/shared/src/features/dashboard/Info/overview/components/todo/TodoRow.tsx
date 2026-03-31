import type { CourseTodoItem } from "@hydrowise/entities";
import { XIcon } from "lucide-react";
import { formatDueRowLabel } from "@/features/dashboard/Info/overview/components/todo/todo-helpers";
import { cn } from "@/lib/utils";

type TodoRowProps = {
  todo: CourseTodoItem;
  onToggle: () => void;
  onRemove: () => void;
};

export const TodoRow = ({ todo, onToggle, onRemove }: TodoRowProps) => {
  const isDone = todo.done;
  const due = todo.dueAt ? formatDueRowLabel(todo.dueAt) : null;

  return (
    <div
      className={cn(
        "group flex items-start gap-2 py-[6px] pr-0.5 pl-0",
        isDone && "opacity-[0.92]",
      )}
    >
      <input
        type="checkbox"
        checked={isDone}
        onChange={onToggle}
        className="mt-[2px] size-[14px] shrink-0 rounded border-border/80 text-primary accent-primary"
        aria-label={isDone ? "Mark incomplete" : "Mark complete"}
      />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-px leading-tight">
        <p
          className={cn(
            "text-[length:var(--type-dashboard-body)] font-medium leading-[1.3] tracking-[-0.012em] text-[var(--text-primary)]",
            isDone &&
              "text-[color-mix(in_srgb,var(--text-tertiary)_88%,var(--text-primary))] line-through",
          )}
        >
          {todo.text}
        </p>
        {due ? (
          <p
            className={cn(
              "text-[10px] leading-[1.2] font-medium tracking-[0.04em] text-[color-mix(in_srgb,var(--text-tertiary)_90%,var(--text-primary))]",
              isDone &&
                "font-[520] text-[color-mix(in_srgb,var(--text-tertiary)_52%,var(--surface))]",
            )}
          >
            {due}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        className="mt-[1px] shrink-0 rounded-md p-0.5 text-muted-foreground/55 opacity-0 transition-[opacity,colors] group-hover:opacity-100 hover:bg-muted/35 hover:text-foreground/80"
        onClick={onRemove}
        aria-label="Remove task"
      >
        <XIcon className="size-2.5" strokeWidth={2.25} />
      </button>
    </div>
  );
};
