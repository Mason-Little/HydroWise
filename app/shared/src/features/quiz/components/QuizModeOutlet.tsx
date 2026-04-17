import { useQuizContext } from "@/features/quiz/context/quiz-context";
import { CreateQuizModule } from "@/features/quiz/modules/create/CreateQuizModule";
import { HistoryQuizModule } from "@/features/quiz/modules/history/HistoryQuizModule";
import { WriteQuizModule } from "@/features/quiz/modules/write/WriteQuizModule";

export const QuizModeOutlet = () => {
  const { view } = useQuizContext();

  switch (view) {
    case "history":
      return <HistoryQuizModule />;
    case "write":
      return <WriteQuizModule />;
    default:
      return <CreateQuizModule />;
  }
};
