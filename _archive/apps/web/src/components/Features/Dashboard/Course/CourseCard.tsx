import { titleToColour } from "@/lib/colour/title-to-colour";
import { useCourseStore } from "@/store/courseStore";

interface CourseCardProps {
  courseId: string;
  title: string;
  documents: number;
  quizzes: number;
}

export const CourseCard = ({
  courseId,
  title,
  documents,
  quizzes,
}: CourseCardProps) => {
  const colour = titleToColour(title);
  const { setSelectedCourseId, selectedCourseId } = useCourseStore();

  const isSelected = selectedCourseId === courseId;

  return (
    <button
      type="button"
      style={{
        backgroundColor: isSelected ? colour.selected : colour.notSelected,
      }}
      onClick={() => setSelectedCourseId(courseId)}
      className="w-full rounded-lg px-3 py-2 text-left"
    >
      <p
        className={`truncate text-sm font-medium ${
          isSelected
            ? "text-white/80 dark:text-black/80"
            : "text-black/80 dark:text-white/80"
        }`}
      >
        {title}
      </p>
      <p
        className={`mt-1 text-xs ${
          isSelected
            ? "text-white/70 dark:text-black/70"
            : "text-black/70 dark:text-white/70"
        }`}
      >
        {documents} docs · {quizzes} {quizzes === 1 ? "quiz" : "quizzes"}
      </p>
    </button>
  );
};
