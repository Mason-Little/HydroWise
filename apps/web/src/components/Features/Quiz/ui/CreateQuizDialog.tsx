import type { Chapter, Course, QuizQuestion } from "@hydrowise/entities";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCourses } from "@/hooks/query/course.queries";
import { useQuiz } from "@/hooks/quiz/useQuiz";
import { CourseChapterCombobox } from "../../Upload/ui/CourseChapterCombobox";

interface CreateQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuizCreated: (quiz: QuizQuestion[]) => void;
}

export const CreateQuizDialog = ({
  open,
  onOpenChange,
  onQuizCreated,
}: CreateQuizDialogProps) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<Chapter[]>([]);
  const { courses } = useCourses();
  const { createQuiz } = useQuiz();

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedCourse(null);
      setSelectedChapters([]);
    }

    onOpenChange(nextOpen);
  };

  const handleCreateQuiz = async () => {
    if (!selectedCourse) return;
    const quiz = await createQuiz(selectedCourse, selectedChapters);
    if (!quiz) return;
    console.log("quiz output", quiz);
    onQuizCreated(quiz);
    handleDialogOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Quiz</DialogTitle>
          <DialogDescription>
            Create a quiz to test your knowledge of water conservation.
          </DialogDescription>
        </DialogHeader>

        <CourseChapterCombobox
          courses={courses}
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
          chapterMultiSelect
          selectedChapters={selectedChapters}
          onChaptersChange={setSelectedChapters}
        />

        <DialogFooter>
          <Button
            onClick={() => {
              handleCreateQuiz();
            }}
          >
            Create Quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
