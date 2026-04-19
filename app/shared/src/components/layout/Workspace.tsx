import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { SidebarInset } from "@/components/ui/sidebar";
import { featureComponents } from "@/config/featureComponents";
import { useFeatureStore } from "@/store/featureStore";

export const Workspace = () => {
  const { activeFeature } = useFeatureStore();
  const Component = featureComponents[activeFeature];

  return (
    <>
      <Sidebar />
      <SidebarInset className="min-h-0 flex-1 overflow-hidden px-[18px] py-2.5">
        <div className="flex min-h-0 flex-1 flex-col gap-2.5">
          <Topbar />
          <Component />
        </div>
      </SidebarInset>
    </>
  );
};
