import { useRef, useState } from "react";
import { normalizeScoreInput } from "@/features/dashboard/Info/overview/components/grades/lib/format";
import { cn } from "@/lib/utils";

type ScoreInputProps = {
  ariaLabel: string;
  onCommit: (score: number) => void;
  placeholder: string;
};

export const ScoreInput = ({
  ariaLabel,
  onCommit,
  placeholder,
}: ScoreInputProps) => {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = () => {
    const normalizedScore = normalizeScoreInput(draft);
    if (normalizedScore === null) {
      setDraft("");
      return;
    }

    onCommit(normalizedScore);
    setDraft("");
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      aria-label={ariaLabel}
      placeholder={placeholder}
      value={draft}
      onBlur={commit}
      onChange={(event) => {
        const nextValue = event.target.value;
        if (nextValue === "" || /^\d*\.?\d*$/.test(nextValue)) {
          setDraft(nextValue);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commit();
        }

        if (event.key === "Escape") {
          setDraft("");
          inputRef.current?.blur();
        }
      }}
      className={cn(
        "inline-flex h-[1.625rem] w-[4.5rem] items-center justify-center rounded-[var(--hw-radius)] border border-dashed border-[var(--border-solid)]/60 bg-transparent px-1.5 text-center shadow-[var(--shadow-sm)] outline-none transition-colors",
        "text-[length:var(--font-size-sm)] text-[var(--text-muted)] placeholder:text-[var(--text-muted)]/70",
        "focus:border-[var(--border-focus)] focus:bg-[var(--surface)]/90 focus:text-[var(--text-secondary)] focus:ring-1 focus:ring-[var(--ring-focus)]",
      )}
    />
  );
};
