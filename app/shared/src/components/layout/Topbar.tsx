import { Input } from "@/components/ui/input";
import { features } from "@/config";
import { SelectedModelPill } from "@/features/ai/model-selection/SelectedModelPill";
import { useFeatureStore } from "@/store/featureStore";

export const Topbar = () => {
  const { activeFeature } = useFeatureStore();

  return (
    <div className="bg-card border-border sticky top-0 z-20 flex w-full shrink-0 items-center justify-between gap-3 rounded-md border p-3 relative">
      <span className="relative z-10 shrink-0 px-3 py-1 text-sm font-semibold tracking-wide">
        {features[activeFeature].label}
      </span>
      <div className="pointer-events-none absolute inset-x-0 flex justify-center px-3">
        <div className="pointer-events-auto w-full max-w-2xl min-w-0">
          <Input
            placeholder="Search courses, documents, topics..."
            className="border-border outline-border h-9 w-full rounded-md border bg-transparent outline outline-1 focus-visible:ring-0"
          />
        </div>
      </div>
      <div className="relative z-10 shrink-0">
        <SelectedModelPill />
      </div>
    </div>
  );
};
