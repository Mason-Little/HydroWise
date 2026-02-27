import { SearchIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";

export type TopBarProps = {
  actions?: ReactNode;
};

export const TopBar = ({ actions }: TopBarProps) => {
  return (
    <div className="flex h-14 items-center gap-3 rounded-md border border-[#ded7cc] bg-[#fffdf8] p-3 mx-5 mt-5">
      <SearchIcon className="size-4 text-[#5b6472]" />
      <Input
        placeholder="Search courses, documents, topics… (try: genetics)"
        className="h-9 flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 text-[#1f2328] placeholder:text-[#5b6472] px-0"
      />
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
};
