import type { ReactElement } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useModelStore } from "@/store/modelStore";
import { ModelBootstrapBanner } from "./components/ModelBootstrapBanner";
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
  const userBootstrapRequired = useModelStore((s) => s.userBootstrapRequired);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={children} />
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[var(--width-popover-panel)] max-w-[var(--max-width-popover)] rounded-xl border border-border bg-card p-2.5 shadow-[var(--shadow-popover)]"
      >
        {userBootstrapRequired && <ModelBootstrapBanner />}
        <ModelSelectToggleGroup />
        <ModelSelectInfo />
      </PopoverContent>
    </Popover>
  );
};
