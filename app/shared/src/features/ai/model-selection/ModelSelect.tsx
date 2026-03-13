import type { ReactElement } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ModelSelectInfo } from "./components/ModelSelectInfo";
import { ModelSelectToggleGroup } from "./components/ModelSelectToggleGroup";

interface ModelSelectProps {
  children: ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ModelSelect = ({ children, open, onOpenChange }: ModelSelectProps) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={children} />
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[var(--width-popover-panel)] max-w-[var(--max-width-popover)] rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-popover)]"
      >
        <ModelSelectToggleGroup />
        <ModelSelectInfo />
      </PopoverContent>
    </Popover>
  );
};
