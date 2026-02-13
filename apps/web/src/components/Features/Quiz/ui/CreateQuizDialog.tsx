import type { Chapter, Course } from "@hydrowise/entities";
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
import { useTopicQueries } from "@/hooks/query/topic.queries";
import { useQuiz } from "@/hooks/quiz/useQuiz";
import { CourseChapterCombobox } from "../../Upload/ui/CourseChapterCombobox";

interface CreateQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateQuizDialog = ({
  open,
  onOpenChange,
}: CreateQuizDialogProps) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<Chapter[]>([]);
  const { retrieveTopics } = useTopicQueries();
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
    if (!selectedCourse?.id) return;
    const promises = selectedChapters.map(async (chapter) => {
      const topics = await retrieveTopics({
        courseId: selectedCourse.id,
        chapterId: chapter.id,
      });

      return {
        selectedCourse: selectedCourse.name,
        selectedChapter: chapter.name,
        topics,
      };
    });
    const inputSchema = await Promise.all(promises);
    await createQuiz(inputSchema);
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
