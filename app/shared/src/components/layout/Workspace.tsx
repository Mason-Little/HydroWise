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
      <SidebarInset className="min-h-0 flex-1 gap-2.5 py-2.5 px-[18px]">
        <Topbar />
        <Component />
      </SidebarInset>
    </>
  );
};
