import { Input } from "@/components/ui/input";
import { features } from "@/config";
import { SelectedModelPill } from "@/features/ai/model-selection/SelectedModelPill";
import { useFeatureStore } from "@/store/featureStore";

export const Topbar = () => {
  const { activeFeature } = useFeatureStore();

  return (
    <div className="bg-card border-border sticky top-0 z-20 flex h-auto w-full shrink-0 flex-row flex-nowrap items-center gap-3 rounded-md border p-3">
      <span className="shrink-0 px-3 py-1 text-sm font-semibold tracking-[0.08em]">
        {features[activeFeature].label}
      </span>
      <div className="min-w-0 flex-1" aria-hidden />
      <div className="w-full max-w-2xl shrink-0">
        <Input
          placeholder="Search courses, documents, topics…"
          className="border-border outline-border h-9 w-full rounded-md border bg-transparent outline outline-1 focus-visible:ring-0"
        />
      </div>
      <div className="min-w-0 flex-1" aria-hidden />
      <SelectedModelPill />
    </div>
  );
};
