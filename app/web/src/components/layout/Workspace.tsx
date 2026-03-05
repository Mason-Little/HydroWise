import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { featureComponents } from "@/config/featureComponents";
import { useFeatureStore } from "@/store/featureStore";

export const Workspace = () => {
  const { activeFeature } = useFeatureStore();
  const Component = featureComponents[activeFeature];

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={false}>
        <Sidebar />
        <SidebarInset className="p-6">
          <Component />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};
