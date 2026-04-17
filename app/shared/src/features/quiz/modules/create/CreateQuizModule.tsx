import { CreateQuizScopeOutlet } from "@/features/quiz/modules/create/CreateQuizScopeOutlet";
import { CreateQuizProvider } from "@/features/quiz/modules/create/context/create-quiz-context";
import { CreateQuizScopeSelector } from "@/features/quiz/modules/create/CreateQuizScopeSelector";

export const CreateQuizModule = () => {
  return (
    <CreateQuizProvider>
      <div className="min-h-0 flex-1 px-6 py-5 md:px-7">
        <div className="flex flex-col gap-5">
          <CreateQuizScopeSelector />
          <CreateQuizScopeOutlet />
        </div>
      </div>
    </CreateQuizProvider>
  );
};
