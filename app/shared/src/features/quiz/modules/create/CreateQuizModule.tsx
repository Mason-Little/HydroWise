import { CreateQuizScopeOutlet } from "@/features/quiz/modules/create/CreateQuizScopeOutlet";
import { CreateQuizScopeSelector } from "@/features/quiz/modules/create/CreateQuizScopeSelector";
import { CreateQuizSidebar } from "@/features/quiz/modules/create/CreateQuizSidebar";
import { CreateQuizProvider } from "@/features/quiz/modules/create/context/create-quiz-context";

export const CreateQuizModule = () => {
  return (
    <CreateQuizProvider>
      <CreateQuizModuleContent />
    </CreateQuizProvider>
  );
};

const CreateQuizModuleContent = () => {
  return (
    <div className="min-h-0 flex-1 overflow-hidden px-3 pb-2 pt-0 md:px-4">
      <div className="grid h-full min-h-0 gap-2.5 xl:grid-cols-[minmax(0,1fr)_293px]">
        <div className="flex min-h-0 min-w-0 flex-col gap-2.5">
          <CreateQuizScopeSelector />
          <div className="min-h-0 flex-1 overflow-hidden rounded-[22px] border border-[color-mix(in_srgb,var(--app-border-solid)_66%,transparent)] bg-[var(--app-surface-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_3px_rgba(15,23,42,0.03)]">
            <div className="no-scrollbar h-full overflow-y-auto [scrollbar-gutter:stable]">
              <CreateQuizScopeOutlet />
            </div>
          </div>
        </div>
        <CreateQuizSidebar />
      </div>
    </div>
  );
};
