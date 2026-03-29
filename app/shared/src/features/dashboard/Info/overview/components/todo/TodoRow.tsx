import type { CourseTodoItem } from "@hydrowise/entities";
import { XIcon } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type TodoRowProps = {
  item: CourseTodoItem;
  pendingFocusId: string | null;
  onBackspaceEmpty: () => void;
  onEnter: () => void;
  onFocusConsumed: () => void;
  onRemove: () => void;
  onTextChange: (text: string) => void;
  onToggleDone: () => void;
  placeholder?: string;
};

const DEFAULT_PLACEHOLDER = "Add a task…";

const onTaskKeyDown = (
  event: KeyboardEvent<HTMLInputElement>,
  text: string,
  handlers: Pick<TodoRowProps, "onBackspaceEmpty" | "onEnter">,
) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handlers.onEnter();
    return;
  }
  if (event.key === "Backspace" && text === "") {
    event.preventDefault();
    handlers.onBackspaceEmpty();
  }
};

const taskTextInputClassName = cn(
  "-mx-1 min-w-0 flex-1 rounded bg-transparent py-0.5 pr-6 pl-1 text-xs text-foreground outline-none",
  "placeholder:text-muted-foreground/50",
  "ring-1 ring-transparent focus:bg-muted/50 focus:ring-ring",
);

const removeTaskButtonClassName = cn(
  "absolute right-0 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity",
  "hover:bg-muted/60 hover:text-foreground",
  "group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
);

export const TodoRow = ({
  item,
  pendingFocusId,
  onBackspaceEmpty,
  onEnter,
  onFocusConsumed,
  onRemove,
  onTextChange,
  onToggleDone,
  placeholder = DEFAULT_PLACEHOLDER,
}: TodoRowProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pendingFocusId !== item.id) return;
    inputRef.current?.focus();
    onFocusConsumed();
  }, [pendingFocusId, item.id, onFocusConsumed]);

  return (
    <li className="group relative flex items-center gap-2">
      <input
        type="checkbox"
        checked={item.done}
        onChange={onToggleDone}
        className="size-4 shrink-0 cursor-pointer rounded border border-input accent-foreground"
        aria-label={item.done ? "Mark task not done" : "Mark task done"}
      />
      <input
        ref={inputRef}
        type="text"
        value={item.text}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={(e) =>
          onTaskKeyDown(e, item.text, { onBackspaceEmpty, onEnter })
        }
        placeholder={placeholder}
        className={taskTextInputClassName}
      />
      <button
        type="button"
        aria-label="Remove task"
        onClick={(e) => {
          e.preventDefault();
          onRemove();
        }}
        className={removeTaskButtonClassName}
      >
        <XIcon className="size-3.5" aria-hidden />
      </button>
    </li>
  );
};
