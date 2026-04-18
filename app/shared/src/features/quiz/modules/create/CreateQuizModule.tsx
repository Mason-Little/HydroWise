import { CreateQuizScopeOutlet } from "@/features/quiz/modules/create/CreateQuizScopeOutlet";
import { CreateQuizScopeSelector } from "@/features/quiz/modules/create/CreateQuizScopeSelector";
import {
  CreateQuizProvider,
  useCreateQuizContext,
} from "@/features/quiz/modules/create/context/create-quiz-context";

const scopeLabelByScope = {
  course: "course",
  chapter: "chapters",
  topic: "topics",
  document: "documents",
} as const;

export const CreateQuizModule = () => {
  return (
    <CreateQuizProvider>
      <CreateQuizModuleContent />
    </CreateQuizProvider>
  );
};

const CreateQuizModuleContent = () => {
  const { activeScope } = useCreateQuizContext();
  const scopeLabel = scopeLabelByScope[activeScope];

  return (
    <div className="min-h-0 flex-1 px-6 pb-3 pt-1 md:px-7">
      <div className="flex flex-col gap-3">
        <div className="border-b border-[var(--app-border-solid)] pb-2.5">
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.16em] text-foreground">
            Select scope • {scopeLabel}
          </p>
          <p className="mt-1 max-w-2xl text-[0.95rem] font-medium leading-6 text-[var(--app-text-muted)]">
            Choose the scope first, then pick the items to include below.
          </p>
        </div>
        <CreateQuizScopeSelector />
        <CreateQuizScopeOutlet />
      </div>
    </div>
  );
};
