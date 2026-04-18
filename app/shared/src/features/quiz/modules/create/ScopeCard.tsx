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
        "group relative flex min-h-[84px] w-full flex-col rounded-[18px] border bg-[var(--app-surface-primary)] px-3.5 py-2.5 text-left shadow-[0_1px_0_rgba(15,23,42,0.02),0_1px_3px_rgba(15,23,42,0.03)] transition-[border-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--course-accent-ring)_75%,var(--app-border-solid))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-surface-primary)]",
        selected
          ? [
              "border-[color-mix(in_srgb,var(--course-accent-ring)_90%,var(--app-border-solid))]",
              "bg-[linear-gradient(180deg,color-mix(in_srgb,var(--course-accent-soft)_58%,var(--app-surface-primary))_0%,color-mix(in_srgb,var(--app-surface-primary)_96%,var(--course-accent-soft))_100%)]",
              "shadow-[0_0_0_1px_color-mix(in_srgb,var(--course-accent-strong)_12%,transparent),0_14px_26px_color-mix(in_srgb,var(--course-accent-strong)_8%,transparent)]",
            ]
          : "border-border/60 hover:-translate-y-0.5 hover:border-border/80 hover:shadow-[0_10px_20px_rgba(37,50,58,0.05)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-7.5 shrink-0 items-center justify-center rounded-[10px] border bg-background shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
            selected
              ? "border-[color-mix(in_srgb,var(--course-accent-ring)_95%,var(--app-border-solid))] text-[color-mix(in_srgb,var(--course-accent-strong)_72%,var(--app-text-primary))]"
              : "border-border/50 text-muted-foreground",
          )}
        >
          <Icon className="size-[14px]" aria-hidden strokeWidth={1.9} />
        </div>
        <div
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
            selected
              ? "border-[color-mix(in_srgb,var(--course-accent-strong)_40%,var(--app-border-solid))] bg-[color-mix(in_srgb,var(--course-accent-strong)_90%,var(--app-surface-primary))]"
              : "border-[color-mix(in_srgb,var(--app-border-solid)_70%,transparent)] bg-transparent",
          )}
          aria-hidden
        >
          <span
            className={cn(
              "size-1.5 rounded-full transition-colors",
              selected
                ? "bg-[color-mix(in_srgb,var(--app-surface-primary)_94%,white)]"
                : "bg-transparent",
            )}
          />
        </div>
      </div>
      <div className="mt-2.5 min-w-0">
        <div
          className={cn(
            "text-[0.88rem] font-bold capitalize tracking-[-0.02em]",
            selected
              ? "text-[color-mix(in_srgb,var(--course-accent-strong)_74%,var(--app-text-primary))]"
              : "text-[var(--app-text-primary)]",
          )}
        >
          {scope.name}
        </div>
        <div className="mt-0.5 max-w-[22ch] text-[0.77rem] font-semibold leading-[1.3] text-[var(--app-text-muted)]">
          {scope.description}
        </div>
      </div>
    </button>
  );
};
