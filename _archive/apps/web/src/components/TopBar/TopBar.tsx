import type { FeatureType } from "@/components/Sidebar/AppSidebar";
import { Input } from "@/components/ui/input";

interface TopBarProps {
  feature: FeatureType;
}

export const TopBar = ({ feature }: TopBarProps) => {
  return (
    <div className="bg-card border-border mx-5 mt-5 flex h-14 items-center gap-3 rounded-md border p-3">
      <span className="px-3 py-1 text-sm font-semibold tracking-[0.08em]">
        {feature}
      </span>
      <div className="flex flex-1 justify-center">
        <Input
          placeholder="Search courses, documents, topics…"
          className="border-border outline-border h-9 w-full max-w-6xl rounded-md border bg-transparent outline outline-1 focus-visible:ring-0"
        />
      </div>
    </div>
  );
};
