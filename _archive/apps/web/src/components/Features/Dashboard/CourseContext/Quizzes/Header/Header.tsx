import { HeaderAverage } from "@/components/Features/Dashboard/CourseContext/Quizzes/Header/HeaderAverage";
import { HeaderCompleted } from "@/components/Features/Dashboard/CourseContext/Quizzes/Header/HeaderCompleted";
import { HeaderStreak } from "@/components/Features/Dashboard/CourseContext/Quizzes/Header/HeaderStreak";

export const Header = () => {
  return (
    <div className="grid w-full grid-cols-3 gap-2">
      <HeaderAverage />
      <HeaderCompleted />
      <HeaderStreak />
    </div>
  );
};
