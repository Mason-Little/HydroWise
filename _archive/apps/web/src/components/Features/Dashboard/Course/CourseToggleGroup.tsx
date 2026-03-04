import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CourseToggleGroupProps {
  activeTab: "active" | "archived";
  setActiveTab: (tab: "active" | "archived") => void;
}

export const CourseToggleGroup = ({
  activeTab,
  setActiveTab,
}: CourseToggleGroupProps) => {
  return (
    <ToggleGroup
      value={[activeTab]}
      onValueChange={([v]) => v && setActiveTab(v as typeof activeTab)}
      spacing={1}
    >
      <ToggleGroupItem
        value="active"
        className="h-auto border border-transparent bg-transparent! px-2.5 py-1 text-xs hover:bg-black/5! aria-pressed:border-[var(--hw-border)]! aria-pressed:bg-transparent! dark:hover:bg-white/5!"
      >
        Active
      </ToggleGroupItem>
      <ToggleGroupItem
        value="archived"
        className="h-auto border border-transparent bg-transparent! px-2.5 py-1 text-xs hover:bg-black/5! aria-pressed:border-[var(--hw-border)]! aria-pressed:bg-transparent! dark:hover:bg-white/5!"
      >
        Archived
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
