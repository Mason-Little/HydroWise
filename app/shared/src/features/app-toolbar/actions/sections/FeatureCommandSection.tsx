import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { featureOrder, features } from "@/config";
import { cn } from "@/lib/utils";
import { useFeatureStore } from "@/store";
import type { FeatureKey } from "@/types/features";
import { ToolbarCommandSectionHeader } from "./ToolbarCommandSectionHeader";

type FeatureCommandSectionProps = {
  searchQuery: string;
  onDismiss: () => void;
};

export function FeatureCommandSection({
  searchQuery,
  onDismiss,
}: FeatureCommandSectionProps) {
  const activeFeature = useFeatureStore((s) => s.activeFeature);
  const setActiveFeature = useFeatureStore((s) => s.setActiveFeature);

  const needle = searchQuery.trim().toLowerCase();
  const matchesNeedle = (key: FeatureKey) =>
    needle === "" || features[key].label.toLowerCase().includes(needle);
  const matchingFeatureKeys = featureOrder.filter(matchesNeedle);

  return (
    <>
      <ToolbarCommandSectionHeader
        id="toolbar-command-section-features"
        className="pt-2"
      >
        Features
      </ToolbarCommandSectionHeader>
      <CommandGroup
        aria-labelledby="toolbar-command-section-features"
        className="p-0 [&_[cmdk-group-heading]]:hidden"
      >
        {matchingFeatureKeys.length === 0 ? (
          <CommandEmpty className="px-[14px] py-2 text-[12px] text-[var(--app-text-muted)]">
            No matching features
          </CommandEmpty>
        ) : (
          matchingFeatureKeys.map((key) => {
            const { label, icon: Icon } = features[key];
            const isActive = activeFeature === key;
            return (
              <CommandItem
                key={key}
                value={`${key}-${label}`}
                onSelect={() => {
                  setActiveFeature(key);
                  onDismiss();
                }}
                className={cn(
                  "rounded-none px-[14px] py-2 text-[12px] font-normal text-[var(--app-text-primary)] data-[selected]:bg-[color-mix(in_srgb,var(--app-workspace-bg)_55%,var(--app-surface-primary))]",
                  isActive &&
                    "bg-[color-mix(in_srgb,var(--app-accent-soft)_75%,var(--app-surface-primary))] font-medium data-[selected]:bg-[color-mix(in_srgb,var(--app-accent-soft)_75%,var(--app-surface-primary))]",
                )}
              >
                <Icon
                  className="size-[14px] shrink-0 text-[var(--app-text-tertiary)]"
                  aria-hidden
                />
                {label}
              </CommandItem>
            );
          })
        )}
      </CommandGroup>
    </>
  );
}
