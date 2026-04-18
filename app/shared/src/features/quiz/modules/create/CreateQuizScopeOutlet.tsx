import { useCreateQuizContext } from "@/features/quiz/modules/create/context/create-quiz-context";
import { ChapterScopePanel } from "@/features/quiz/modules/create/scopes/ChapterScopePanel";
import { CourseScopePanel } from "@/features/quiz/modules/create/scopes/CourseScopePanel";
import { DocumentScopePanel } from "@/features/quiz/modules/create/scopes/DocumentScopePanel";
import { TopicScopePanel } from "@/features/quiz/modules/create/scopes/TopicScopePanel";

export const CreateQuizScopeOutlet = () => {
  const { selection, setSelection } = useCreateQuizContext();

  switch (selection.scope) {
    case "course":
      return <CourseScopePanel />;
    case "chapter":
      return (
        <ChapterScopePanel
          chapterIds={selection.chapterIds}
          setSelection={setSelection}
        />
      );
    case "document":
      return (
        <DocumentScopePanel
          documentIds={selection.documentIds}
          setSelection={setSelection}
        />
      );
    case "topic":
      return (
        <TopicScopePanel
          topicIds={selection.topicIds}
          setSelection={setSelection}
        />
      );
  }
};
