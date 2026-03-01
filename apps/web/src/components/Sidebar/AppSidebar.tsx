import {
  BookIcon,
  CopyIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  PencilIcon,
} from "lucide-react";
import { HydroWiseLogo } from "@/components/ui/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type FeatureType = "chat" | "dashboard" | "quiz" | "flash" | "notes";

type SidebarProps = {
  feature: FeatureType;
  setFeature: (feature: FeatureType) => void;
};

const navigation = [
  { name: "Dashboard", id: "dashboard", icon: LayoutDashboardIcon },
  { name: "Chat", id: "chat", icon: MessageSquareIcon },
  { name: "Quiz", id: "quiz", icon: BookIcon },
  { name: "Flashcards", id: "flash", icon: CopyIcon },
  { name: "Notes", id: "notes", icon: PencilIcon },
] as const;

export const AppSidebar = ({ feature, setFeature }: SidebarProps) => {
  return (
    <Sidebar
      collapsible="icon"
      className="bg-sidebar border-sidebar-border border-r"
    >
      <SidebarHeader className="flex flex-col items-center py-6">
        <div className="flex w-full justify-center">
          <div className="flex items-center justify-center rounded-md border border-transparent bg-transparent group-data-[state=collapsed]:h-[42px] group-data-[state=collapsed]:w-[42px] group-data-[state=collapsed]:border-sidebar-border group-data-[state=collapsed]:bg-sidebar group-data-[state=expanded]:w-full group-data-[state=expanded]:px-2">
            <div className="flex items-center gap-2">
              <HydroWiseLogo className="shrink-0" />
              <span className="font-semibold tracking-tight text-sidebar-foreground truncate group-data-[state=collapsed]:hidden text-lg">
                HydroWise
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 gap-2 flex flex-col pt-2">
        <SidebarMenu className="gap-2">
          {navigation.map((item) => {
            const isActive = feature === item.id;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  tooltip={item.name}
                  isActive={isActive}
                  onClick={() => setFeature(item.id)}
                  className={cn(
                    "flex items-center h-11 w-full rounded-md transition-colors",
                    "group-data-[collapsible=icon]:!h-11 group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!p-0",
                    "group-data-[state=collapsed]:justify-center group-data-[state=expanded]:justify-start group-data-[state=expanded]:px-3",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground shadow-sm"
                      : "bg-transparent text-muted-foreground hover:bg-sidebar-accent/60",
                  )}
                >
                  <item.icon
                    className={cn(
                      "shrink-0",
                      isActive
                        ? "text-sidebar-foreground"
                        : "text-muted-foreground",
                    )}
                    size={24}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="truncate ml-2 group-data-[state=collapsed]:hidden font-medium">
                    {item.name}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
