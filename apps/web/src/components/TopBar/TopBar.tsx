import type { FeatureType } from "@/components/Sidebar/AppSidebar";
import { Input } from "@/components/ui/input";

interface TopBarProps {
  feature: FeatureType;
}

export const TopBar = ({ feature }: TopBarProps) => {
  return (
    <div className="flex h-14 items-center gap-3 rounded-md border border-[#ded7cc] bg-[#fffdf8] p-3 mx-5 mt-5">
      <span className="px-3 py-1 text-sm font-semibold tracking-[0.08em]">
        {feature}
      </span>
      <div className="flex flex-1 justify-center">
        <Input
          placeholder="Search courses, documents, topics…"
          className="h-9 w-full max-w-6xl rounded-md border border-[#ded7cc] bg-transparent outline outline-1 outline-[#ded7cc] focus-visible:ring-0"
        />
      </div>
    </div>
  );
};
