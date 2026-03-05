import { Chapter } from "@/features/dashboard/Info/chapters/Chapter";
import { Overview } from "@/features/dashboard/Info/overview/Overview";
import { Quiz } from "@/features/dashboard/Info/quiz/Quiz";

export const Info = () => {
  return (
    <div>
      <Overview />
      <Chapter />
      <Quiz />
    </div>
  );
};
