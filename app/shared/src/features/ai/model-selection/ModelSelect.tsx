import type { ReactElement } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ModelSelectInfo } from "./components/ModelSelectInfo";
import { ModelSelectToggleGroup } from "./components/ModelSelectToggleGroup";
import type { TempModelStateMap } from "./SelectedModelPill";
import type { LanguageModelId } from "./temp-config";

interface ModelSelectProps {
  children: ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModelId: LanguageModelId;
  activeModelId: LanguageModelId;
  modelStates: TempModelStateMap;
  onSelectModel: (id: LanguageModelId) => void;
  onStartDownload: (id: LanguageModelId) => void;
  onWarmUp: (id: LanguageModelId) => void;
}

export const ModelSelect = ({
  children,
  open,
  onOpenChange,
  selectedModelId,
  activeModelId,
  modelStates,
  onSelectModel,
  onStartDownload,
  onWarmUp,
}: ModelSelectProps) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={children} />
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[var(--width-popover-panel)] max-w-[var(--max-width-popover)] rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-popover)]"
      >
        <ModelSelectToggleGroup
          selectedModelId={selectedModelId}
          onSelectModel={onSelectModel}
        />
        <ModelSelectInfo
          selectedModelId={selectedModelId}
          activeModelId={activeModelId}
          modelState={modelStates[selectedModelId]}
          onStartDownload={onStartDownload}
          onWarmUp={onWarmUp}
        />
      </PopoverContent>
    </Popover>
  );
};
