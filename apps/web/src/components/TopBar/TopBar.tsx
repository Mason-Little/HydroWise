import { SearchIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";

export type TopBarProps = {
  actions?: ReactNode;
};

export const TopBar = ({ actions }: TopBarProps) => {
  return (
    <div className="flex h-14 items-center gap-3 rounded-md border border-border bg-primary-foreground p-3 m-5">
      <SearchIcon className="size-4" />
      <Input
        placeholder="Search courses, documents, topics… (try: genetics)"
        className="h-9 flex-1 border-border bg-primary-foreground text-[#5b6472] placeholder:text-[#5b6472]"
      />
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
};
