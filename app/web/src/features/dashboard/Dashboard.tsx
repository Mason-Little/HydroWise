import { Info } from "@/features/dashboard/Info/Info";
import { Selection } from "@/features/dashboard/selection/Selection";

export const Dashboard = () => {
  return (
    <div>
      <Selection />
      <Info />
    </div>
  );
};
