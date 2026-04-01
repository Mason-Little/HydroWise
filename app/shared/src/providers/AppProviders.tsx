import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { type PlatformConfig, PlatformProvider } from "@/platform";

const queryClient = new QueryClient();

type AppProvidersProps = {
  platform: PlatformConfig;
  children: ReactNode;
};

export const AppProviders = ({ platform, children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PlatformProvider platform={platform}>
        <TooltipProvider>
          <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
        </TooltipProvider>
      </PlatformProvider>
    </QueryClientProvider>
  );
};
