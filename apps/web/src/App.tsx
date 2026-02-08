import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SideBar } from "@/components/Sidebar/SideBar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Workspace } from "@/components/Workspace";
import { queryClient } from "@/lib/query/query-client";

export function App() {
  const [feature, setFeature] = useState<"chat" | "context">("chat");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <SideBar setFeature={setFeature} />
          <SidebarInset className="min-h-svh bg-transparent">
            <header className="bg-background/70 supports-[backdrop-filter]:bg-background/60 border-border/60 sticky top-0 z-20 flex h-14 items-center gap-2 border-b px-4 backdrop-blur-md md:hidden">
              <SidebarTrigger className="-ml-1" />
              <div className="text-sm font-medium tracking-tight">
                HydroWise
              </div>
            </header>
            <div className="flex h-full flex-1 p-3 md:p-5">
              <Workspace feature={feature} />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
