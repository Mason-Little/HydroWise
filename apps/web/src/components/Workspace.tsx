import { useState } from "react";
import { ChatBox } from "@/components/Features/Chat/ChatBox";
import { ContextBox } from "@/components/Features/Context/ContextBox";
import { FlashcardBox } from "@/components/Features/Flashcards/FlashcardBox";
import { NotesBox } from "@/components/Features/Notes/NotesBox";
import { QuizBox } from "@/components/Features/Quiz/QuizBox";
import { AppSidebar, type FeatureType } from "@/components/Sidebar/AppSidebar";
import { TopBar } from "@/components/TopBar/TopBar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Workspace = () => {
  const [feature, setFeature] = useState<FeatureType>("context");

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar feature={feature} setFeature={setFeature} />
        <SidebarInset className="min-h-svh bg-[#f8f9fa]">
          <header className="bg-background/70 supports-[backdrop-filter]:bg-background/60 border-border/60 sticky top-0 z-20 flex h-14 items-center gap-2 border-b px-4 backdrop-blur-md md:hidden">
            <SidebarTrigger className="-ml-1" />
            <div className="text-sm font-medium tracking-tight">HydroWise</div>
          </header>
          <TopBar feature={feature} />
          <div className="flex h-full flex-1 p-3 md:p-5">
            {feature === "chat" && <ChatBox />}
            {feature === "context" && <ContextBox />}
            {feature === "quiz" && <QuizBox />}
            {feature === "flash" && <FlashcardBox />}
            {feature === "notes" && <NotesBox />}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};
