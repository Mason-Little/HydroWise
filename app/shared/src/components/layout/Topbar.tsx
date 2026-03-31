import { features } from "@/config";
import { AppActionBar } from "@/features/app-toolbar/actions/AppActionBar";
import { AppGlobalControls } from "@/features/app-toolbar/controls/AppGlobalControls";
import { useFeatureStore } from "@/store/featureStore";

export const Topbar = () => {
  const { activeFeature } = useFeatureStore();

  return (
    <div className="relative sticky top-0 z-20 flex w-full shrink-0 items-center justify-between gap-2.5 rounded-md border border-border bg-card px-3 py-2.5">
      <span className="relative z-10 shrink-0 px-2.5 py-0.5 text-xs font-semibold tracking-wide">
        {features[activeFeature].label}
      </span>
      <AppActionBar />
      <AppGlobalControls />
    </div>
  );
};
