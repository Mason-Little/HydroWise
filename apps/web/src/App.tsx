import { QueryClientProvider } from "@tanstack/react-query";
// import { useEffect } from "react";
import { ChatBox } from "@/components/ChatBox";
import { SideBar } from "@/components/SideBar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { queryClient } from "@/lib/query-client";
// import { useLLMStore } from "@/store/llmStore";

export function App() {
  // const { warmUp } = useLLMStore();
  // useEffect(() => {
  //   warmUp();
  // }, [warmUp]);
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <SideBar />
        <SidebarInset className="min-h-svh bg-transparent">
          <header className="bg-background/70 supports-[backdrop-filter]:bg-background/60 border-border/60 sticky top-0 z-20 flex h-14 items-center gap-2 border-b px-4 backdrop-blur-md md:hidden">
            <SidebarTrigger className="-ml-1" />
            <div className="text-sm font-medium tracking-tight">HydroWise</div>
          </header>
          <div className="flex h-full flex-1 p-3 md:p-5">
            <ChatBox />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;
