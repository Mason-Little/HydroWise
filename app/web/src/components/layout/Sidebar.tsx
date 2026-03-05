import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { featureOrder, features } from "@/config";
import { useFeatureStore } from "@/store";

export const Sidebar = () => {
  const { activeFeature, setActiveFeature } = useFeatureStore();
  return (
    <SidebarComponent collapsible="icon">
      <SidebarHeader>
        <div className="px-2 py-1 text-sm font-semibold">HydroWise</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {featureOrder.map((featureKey) => {
                const feature = features[featureKey];
                const Icon = feature.icon;

                return (
                  <SidebarMenuItem key={featureKey}>
                    <SidebarMenuButton
                      isActive={activeFeature === featureKey}
                      onClick={() => setActiveFeature(featureKey)}
                      tooltip={feature.label}
                    >
                      <Icon />
                      <span>{feature.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};
