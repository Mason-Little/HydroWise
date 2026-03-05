import { GlassWaterIcon } from "lucide-react";
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
        <div className="flex flex-1 items-center justify-center">
          <GlassWaterIcon className="size-8 shrink-0" />
        </div>
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
