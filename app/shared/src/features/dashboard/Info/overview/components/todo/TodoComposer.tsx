import { format } from "date-fns";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDueStorage } from "@/features/dashboard/Info/overview/components/todo/todo-helpers";
import { cn } from "@/lib/utils";

type TodoComposerProps = {
  onSave: (title: string, dueAt: string | null) => void;
  onCancel: () => void;
  isSaving: boolean;
};

export const TodoComposer = ({
  onSave,
  onCancel,
  isSaving,
}: TodoComposerProps) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [dueOpen, setDueOpen] = useState(false);

  const trimmed = title.trim();
  const canSave = trimmed.length > 0 && !isSaving;

  const submit = () => {
    if (!canSave) return;
    onSave(trimmed, dueDate ? formatDueStorage(dueDate) : null);
  };

  const applyDueDate = (d: Date | undefined) => {
    setDueDate(d);
    setDueOpen(false);
  };

  return (
    <div className="flex min-h-0 flex-col gap-2.5">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        // biome-ignore lint/a11y/noAutofocus: rail compose surface should capture focus when opened
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onCancel();
            return;
          }
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        className={cn(
          "w-full rounded-[10px] border border-border/55 bg-surface px-2.5 py-2 text-[length:var(--type-dashboard-body)] font-medium leading-snug tracking-[-0.015em] text-[var(--text-primary)] outline-none",
          "placeholder:font-normal placeholder:text-[color-mix(in_srgb,var(--text-tertiary)_82%,var(--text-primary))]",
          "focus:border-primary/35 focus:ring-2 focus:ring-primary/10",
        )}
      />
      <Popover open={dueOpen} onOpenChange={setDueOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              className={cn(
                "w-full rounded-[10px] border border-border/45 bg-surface px-2.5 py-2 text-left text-[length:var(--type-dashboard-label)] font-medium leading-snug tracking-[-0.01em] text-[color-mix(in_srgb,var(--text-tertiary)_92%,var(--text-primary))] transition-colors",
                "hover:border-primary/22 hover:text-[var(--text-primary)]",
              )}
            >
              {dueDate ? (
                <span className="tabular-nums">
                  {format(dueDate, "EEE, MMM d")}
                </span>
              ) : (
                <span className="text-[color-mix(in_srgb,var(--text-tertiary)_88%,var(--text-primary))]">
                  Due date
                </span>
              )}
            </button>
          }
        />
        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-auto gap-0 rounded-xl border border-border/45 bg-surface p-2.5 text-xs shadow-[0_10px_28px_rgba(37,50,58,0.1)] ring-0"
        >
          <Calendar mode="single" selected={dueDate} onSelect={applyDueDate} />
          {dueDate ? (
            <div className="border-border/35 border-t px-1 pt-1.5">
              <button
                type="button"
                className="w-full rounded-md py-1 text-center text-[length:var(--type-dashboard-micro)] font-semibold tracking-[0.02em] text-[color-mix(in_srgb,var(--text-tertiary)_88%,var(--text-primary))] transition-colors hover:bg-muted/40 hover:text-[var(--text-primary)]"
                onClick={() => applyDueDate(undefined)}
              >
                Clear date
              </button>
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
      <div className="flex gap-2 pt-0.5">
        <button
          type="button"
          disabled={isSaving}
          onClick={onCancel}
          className="min-h-0 flex-1 rounded-[10px] border border-border/65 bg-transparent py-2 text-[length:var(--type-dashboard-micro)] font-bold tracking-[0.02em] text-[color-mix(in_srgb,var(--text-tertiary)_92%,var(--text-primary))] transition-colors hover:border-border hover:text-[var(--text-primary)] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!canSave}
          onClick={submit}
          className="min-h-0 flex-1 rounded-[10px] border border-primary/28 bg-[color-mix(in_srgb,var(--primary)_12%,var(--surface))] py-2 text-[length:var(--type-dashboard-micro)] font-bold tracking-[0.02em] text-[var(--text-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_18%,var(--surface))] disabled:pointer-events-none disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  );
};
