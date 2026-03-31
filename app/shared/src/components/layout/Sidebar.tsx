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
import { useFeatureStore } from "@/store/featureStore";

export const Sidebar = () => {
  const { activeFeature, setActiveFeature } = useFeatureStore();
  return (
    <SidebarComponent collapsible="icon">
      <SidebarHeader className="m-0 items-center pt-6 pb-3 group-data-[collapsible=icon]:px-0">
        <div className="flex flex-1 items-center justify-center">
          <GlassWaterIcon
            className="size-[30px] shrink-0 text-[var(--app-accent-strong)]"
            strokeWidth={1.75}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="pb-[18px]">
        <SidebarGroup className="px-0 py-0 group-data-[collapsible=icon]:items-center">
          <SidebarGroupContent className="flex w-full flex-col items-center">
            <SidebarMenu className="gap-1.5 group-data-[collapsible=icon]:gap-[7px]">
              {featureOrder.map((featureKey) => {
                const feature = features[featureKey];
                const Icon = feature.icon;

                return (
                  <SidebarMenuItem
                    key={featureKey}
                    className="flex justify-center group-data-[collapsible=icon]:my-0"
                  >
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
