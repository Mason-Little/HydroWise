import {
  BookOpen,
  FileText,
  LibraryBig,
  type LucideIcon,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ScopeCardProps = {
  scope: {
    name: string;
    description: string;
  };
  selected: boolean;
  onSelect: () => void;
};

const scopeIcons: Record<ScopeCardProps["scope"]["name"], LucideIcon> = {
  course: LibraryBig,
  chapter: BookOpen,
  topic: Tags,
  document: FileText,
};

export const ScopeCard = ({ scope, selected, onSelect }: ScopeCardProps) => {
  const Icon = scopeIcons[scope.name];

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "group relative flex min-h-[148px] w-full flex-col rounded-[24px] border bg-[var(--app-surface-primary)] px-4 py-4 text-left shadow-[0_1px_0_rgba(15,23,42,0.02),0_1px_3px_rgba(15,23,42,0.03)] transition-[border-color,box-shadow,transform] duration-200",
        selected
          ? [
              "border-[var(--course-accent-ring)]",
              "bg-[radial-gradient(circle_at_50%_42%,color-mix(in_srgb,var(--course-accent-soft)_62%,var(--app-surface-primary)),rgba(255,255,255,0.98)_58%)]",
              "shadow-[0_0_0_1px_color-mix(in_srgb,var(--course-accent-strong)_10%,transparent),0_12px_28px_color-mix(in_srgb,var(--course-accent-strong)_8%,transparent)]",
            ]
          : "border-border/60 hover:-translate-y-0.5 hover:border-border/80",
      )}
    >
      <div
        className={cn(
          "mb-4 size-5 rounded-full border-2",
          selected
            ? "border-[color-mix(in_srgb,var(--course-accent-strong)_55%,var(--app-border-solid))] bg-[color-mix(in_srgb,var(--course-accent-soft)_78%,var(--app-surface-primary))]"
            : "border-border/70 bg-transparent",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "mb-5 flex size-11 items-center justify-center rounded-[14px] border bg-background shadow-sm",
          selected
            ? "border-[color-mix(in_srgb,var(--course-accent-ring)_90%,var(--app-border-solid))] text-[color-mix(in_srgb,var(--course-accent-strong)_68%,var(--app-text-primary))]"
            : "border-border/50 text-muted-foreground",
        )}
      >
        <Icon className="size-[18px]" aria-hidden strokeWidth={1.9} />
      </div>
      <div className="mt-auto min-w-0">
        <div
          className={cn(
            "text-[1rem] font-bold capitalize tracking-[-0.02em]",
            selected
              ? "text-[color-mix(in_srgb,var(--course-accent-strong)_72%,var(--app-text-primary))]"
              : "text-[var(--app-text-primary)]",
          )}
        >
          {scope.name}
        </div>
        <div
          className={cn(
            "mt-1 max-w-[22ch] text-[0.92rem] font-semibold leading-[1.35]",
            selected
              ? "text-[color-mix(in_srgb,var(--course-accent-strong)_56%,var(--app-text-tertiary))]"
              : "text-[var(--app-text-muted)]",
          )}
        >
          {scope.description}
        </div>
      </div>
    </button>
  );
};
