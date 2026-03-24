import { Chapter } from "@/features/dashboard/Info/chapters/Chapter";
import { Overview } from "@/features/dashboard/Info/overview/Overview";

export const Info = () => {
  return (
    <div>
      <Overview />
      <Chapter />
    </div>
  );
};
