import { Input } from "@/components/ui/input";
import { features } from "@/config";
import { useFeatureStore } from "@/store/featureStore";

export const Topbar = () => {
  const { activeFeature } = useFeatureStore();

  return (
    <div className="bg-card border-border sticky top-0 z-20 relative flex h-14 items-center gap-3 rounded-md border p-3">
      <span className="px-3 py-1 text-sm font-semibold tracking-[0.08em]">
        {features[activeFeature].label}
      </span>
      <div className="absolute left-1/2 top-1/2 z-10 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 px-4">
        <Input
          placeholder="Search courses, documents, topics…"
          className="border-border outline-border h-9 w-full rounded-md border bg-transparent outline outline-1 focus-visible:ring-0"
        />
      </div>
    </div>
  );
};
