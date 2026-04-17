import { useCreateQuizContext } from "@/features/quiz/modules/create/context/create-quiz-context";
import { ChapterScopePanel } from "@/features/quiz/modules/create/scopes/ChapterScopePanel";
import { CourseScopePanel } from "@/features/quiz/modules/create/scopes/CourseScopePanel";
import { DocumentScopePanel } from "@/features/quiz/modules/create/scopes/DocumentScopePanel";
import { TopicScopePanel } from "@/features/quiz/modules/create/scopes/TopicScopePanel";

export const CreateQuizScopeOutlet = () => {
  const { activeScope } = useCreateQuizContext();

  switch (activeScope) {
    case "course":
      return <CourseScopePanel />;
    case "chapter":
      return <ChapterScopePanel />;
    case "document":
      return <DocumentScopePanel />;
    default:
      return <TopicScopePanel />;
  }
};
