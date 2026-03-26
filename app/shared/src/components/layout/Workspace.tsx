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
      <SidebarInset className="p-5">
        <Topbar />
        <Component />
      </SidebarInset>
    </>
  );
};
