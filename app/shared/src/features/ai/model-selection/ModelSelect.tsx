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

export const ModelSelect = ({
  children,
  open,
  onOpenChange,
}: ModelSelectProps) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={children} />
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[26rem] max-w-[calc(100vw-2rem)] rounded-[var(--hw-radius-2xl)] border border-[var(--border-solid)] bg-[var(--surface)] p-3 shadow-[var(--shadow-popover)]"
      >
        <ModelSelectToggleGroup />
        <ModelSelectInfo />
      </PopoverContent>
    </Popover>
  );
};
