import { featureOrder, features } from "@/config";
import { cn } from "@/lib/utils";
import { useFeatureStore } from "@/store";

type FeatureActionResultsProps = {
  query: string;
  onClosePanel: () => void;
};

export function FeatureActionResults({
  query,
  onClosePanel,
}: FeatureActionResultsProps) {
  const activeFeature = useFeatureStore((s) => s.activeFeature);
  const setActiveFeature = useFeatureStore((s) => s.setActiveFeature);

  const needle = query.trim().toLowerCase();
  const matching = featureOrder.filter(
    (key) =>
      needle === "" || features[key].label.toLowerCase().includes(needle),
  );

  return (
    <div className="flex flex-col gap-0.5">
      {matching.length === 0 ? (
        <p className="px-2 py-1.5 text-muted-foreground">
          No matching features
        </p>
      ) : (
        matching.map((key) => {
          const { label, icon: Icon } = features[key];
          const isActive = activeFeature === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setActiveFeature(key);
                onClosePanel();
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs transition-colors",
                "hover:bg-accent/40",
                isActive && "bg-accent font-medium text-accent-foreground",
              )}
            >
              <Icon className="size-3.5 shrink-0 opacity-70" aria-hidden />
              {label}
            </button>
          );
        })
      )}
    </div>
  );
}
