import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PlatformProvider, type PlatformConfig } from "@/platform";

type AppProvidersProps = {
  platform: PlatformConfig;
  children: ReactNode;
};

export const AppProviders = ({ platform, children }: AppProvidersProps) => {
  return (
    <PlatformProvider platform={platform}>
      <TooltipProvider>
        <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
      </TooltipProvider>
    </PlatformProvider>
  );
};
