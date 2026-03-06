import { Workspace } from "@/components/layout/Workspace";
import { usePlatform } from "@/platform";

export const App = () => {
  const platform = usePlatform();

  return (
    <div className="contents" data-platform={platform.kind}>
      <Workspace />
    </div>
  );
};
