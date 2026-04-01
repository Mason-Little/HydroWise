import { features } from "@/config";
import { AppActionBar } from "@/features/app-toolbar/actions/AppActionBar";
import { AppGlobalControls } from "@/features/app-toolbar/controls/AppGlobalControls";
import { useFeatureStore } from "@/store/featureStore";

export const Topbar = () => {
  const { activeFeature } = useFeatureStore();

  return (
    <header className="relative z-20 grid w-full shrink-0 grid-cols-[minmax(0,200px)_minmax(0,1fr)_auto] items-center gap-4 rounded-[var(--app-radius-workspace)] border border-[color-mix(in_srgb,var(--app-border-solid)_54%,transparent)] bg-[color-mix(in_srgb,var(--app-surface-primary)_88%,var(--app-workspace-bg))] px-4 py-2.5 shadow-[0_1px_0_color-mix(in_srgb,var(--app-surface-primary)_78%,transparent)_inset,0_10px_30px_rgba(37,50,58,0.042),0_2px_8px_rgba(37,50,58,0.028)]">
      <div className="min-w-0">
        <div className="flex min-w-0 flex-col gap-[3px]">
          <span className="text-[length:var(--type-dashboard-topbar)] leading-tight font-semibold tracking-[-0.02em] text-[var(--app-text-primary)]">
            HydroWise
          </span>
          <span className="truncate text-[length:var(--type-dashboard-topbar)] leading-tight font-medium text-[var(--app-text-muted)]">
            {features[activeFeature].label}
          </span>
        </div>
      </div>
      <AppActionBar />
      <AppGlobalControls />
    </header>
  );
};
