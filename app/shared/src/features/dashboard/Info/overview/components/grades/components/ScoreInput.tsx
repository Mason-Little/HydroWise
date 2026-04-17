import { type CSSProperties, useEffect, useRef, useState } from "react";
import { normalizeScoreInput } from "@/features/dashboard/Info/overview/components/grades/lib/format";
import { cn } from "@/lib/utils";

type ScoreInputProps = {
  accent: string;
  ariaLabel: string;
  autoFocus: boolean;
  onCommit: (score: number) => void;
  onDismiss: () => void;
  placeholder: string;
};

export const ScoreInput = ({
  accent,
  ariaLabel,
  autoFocus,
  onCommit,
  onDismiss,
  placeholder,
}: ScoreInputProps) => {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoFocus) return;

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [autoFocus]);

  const tryCommit = (): boolean => {
    const normalizedScore = normalizeScoreInput(draft);
    if (normalizedScore === null) {
      return false;
    }

    onCommit(normalizedScore);
    setDraft("");
    return true;
  };

  const handleBlur = () => {
    if (tryCommit()) {
      return;
    }

    setDraft("");
    onDismiss();
  };

  const chipStyle = {
    "--chip-accent": accent,
  } as CSSProperties;

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      aria-label={ariaLabel}
      placeholder={placeholder}
      value={draft}
      style={chipStyle}
      onBlur={handleBlur}
      onChange={(event) => {
        const nextValue = event.target.value;
        if (nextValue === "" || /^\d*\.?\d*$/.test(nextValue)) {
          setDraft(nextValue);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          tryCommit();
        }

        if (event.key === "Escape") {
          event.preventDefault();
          setDraft("");
          onDismiss();
        }
      }}
      className={cn(
        "box-border h-[var(--assess-chip-h)] w-[var(--assess-chip-minw)] min-w-[var(--assess-chip-minw)] max-w-[var(--assess-chip-minw)] shrink-0 rounded-[var(--assess-chip-r)] border border-solid px-[var(--assess-chip-pad-x)] text-center text-[length:var(--assess-chip-fs)] font-semibold tabular-nums leading-none outline-none transition-[border-color,box-shadow,background]",
        "border-[color-mix(in_srgb,var(--chip-accent)_30%,var(--border-solid))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_94%,var(--chip-accent)_5%)_0%,color-mix(in_srgb,var(--surface)_88%,var(--chip-accent)_9%)_100%)] text-[color-mix(in_srgb,var(--chip-accent)_12%,var(--text-primary))]",
        "placeholder:font-medium placeholder:text-[color-mix(in_srgb,var(--chip-accent)_18%,var(--text-tertiary))]",
        "focus:border-[color-mix(in_srgb,var(--chip-accent)_42%,var(--border-solid))] focus:shadow-[0_0_0_2px_color-mix(in_srgb,var(--chip-accent)_16%,transparent)]",
        "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(37,50,58,0.038)]",
      )}
    />
  );
};
