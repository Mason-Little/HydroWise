import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/store/quizStore";
import { CreateQuizDialog } from "./CreateQuizDialog";

export const CreateQuizButton = () => {
  const [open, setOpen] = useState(false);
  const { setCurrentQuiz } = useQuizStore();

  return (
    <>
      <Button
        className="h-9 border border-black/10 bg-[#c4d5ff] px-3 font-semibold text-[#1f2a4a] shadow-none hover:bg-[#b4c5ef]"
        onClick={() => setOpen(true)}
      >
        Create Quiz
      </Button>
      <CreateQuizDialog
        open={open}
        onOpenChange={setOpen}
        onQuizCreated={(quiz) => {
          setCurrentQuiz(quiz);
          setOpen(false);
        }}
      />
    </>
  );
};
