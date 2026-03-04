import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ContextToggleGroupProps {
  activeTab: "overview" | "chapters" | "quizzes";
  setActiveTab: (tab: "overview" | "chapters" | "quizzes") => void;
}

export const ContextToggleGroup = ({
  activeTab,
  setActiveTab,
}: ContextToggleGroupProps) => {
  return (
    <ToggleGroup
      orientation="horizontal"
      value={[activeTab]}
      onValueChange={([v]) => v && setActiveTab(v as typeof activeTab)}
      spacing={1}
    >
      <ToggleGroupItem
        value="overview"
        className="h-auto border border-transparent bg-transparent! px-2.5 py-1 text-xs hover:bg-black/5! aria-pressed:border-[var(--hw-border)]! aria-pressed:bg-transparent! dark:hover:bg-white/5!"
      >
        Overview
      </ToggleGroupItem>
      <ToggleGroupItem
        value="chapters"
        className="h-auto border border-transparent bg-transparent! px-2.5 py-1 text-xs hover:bg-black/5! aria-pressed:border-[var(--hw-border)]! aria-pressed:bg-transparent! dark:hover:bg-white/5!"
      >
        Chapters
      </ToggleGroupItem>
      <ToggleGroupItem
        value="quizzes"
        className={
          "h-auto justify-start border border-transparent bg-transparent! px-2.5 py-1 text-xs hover:bg-black/5! aria-pressed:border-[var(--hw-border)]! aria-pressed:bg-transparent! dark:hover:bg-white/5!"
        }
      >
        Quizzes
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
