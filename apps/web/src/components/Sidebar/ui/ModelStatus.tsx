import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { modelStore } from "@/store/modelStore";

const getStatusLabel = (status: "cold" | "warming" | "warm") => {
  if (status === "warm") return "Ready";
  if (status === "warming") return "Warming";
  return "Cold";
};

const getStatusVariant = (status: "cold" | "warming" | "warm") => {
  if (status === "warm") return "default" as const;
  if (status === "warming") return "secondary" as const;
  return "outline" as const;
};

const getProgressValue = (
  status: "cold" | "warming" | "warm",
  progress: number,
) => {
  if (status === "warm") return 100;
  if (status === "cold") return 4;
  return Math.max(10, Math.min(progress, 96));
};

export const ModelStatus = () => {
  const { inferenceStatus, initAllEngines } = modelStore();
  const [isStartingWarmup, setIsStartingWarmup] = useState(false);

  const models = Object.entries(inferenceStatus);
  const warmCount = models.filter(
    ([, status]) => status.status === "warm",
  ).length;
  const areAllWarm = warmCount === models.length;
  const isWarming = models.some(([, status]) => status.status === "warming");
  const isBusy = isStartingWarmup || isWarming;

  const handleWarmModels = async () => {
    if (isBusy || areAllWarm) {
      return;
    }

    try {
      setIsStartingWarmup(true);
      await initAllEngines();
    } finally {
      setIsStartingWarmup(false);
    }
  };

  return (
    <Collapsible
      defaultOpen
      className="space-y-3 rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/25 p-3"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-sidebar-accent/35">
        <div className="space-y-0.5">
          <p className="text-sidebar-foreground text-sm font-semibold tracking-tight">
            Model Status
          </p>
          <p className="text-sidebar-foreground/60 text-xs">
            {warmCount} of {models.length} models ready
          </p>
        </div>
      </CollapsibleTrigger>

      {/* TODO: add animations + fix jumpy progress from client note: we could probably just add a new loading bar if there is a new progress lower then the last one*/}
      <CollapsibleContent>
        <div className="space-y-2">
          {models.map(([model, status]) => (
            <div
              key={model}
              className="space-y-1.5 rounded-xl bg-sidebar/80 p-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sidebar-foreground text-xs font-medium">
                  {model}
                </p>
                <Badge
                  variant={getStatusVariant(status.status)}
                  className="text-[10px] uppercase tracking-wide"
                >
                  {getStatusLabel(status.status)}
                </Badge>
              </div>
              <Progress
                value={getProgressValue(status.status, status.progress)}
                className="gap-0 [&_[data-slot=progress-indicator]]:bg-sidebar-primary [&_[data-slot=progress-track]]:h-1.5"
              />
            </div>
          ))}
        </div>
      </CollapsibleContent>

      <Button
        type="button"
        size="sm"
        className="w-full rounded-xl"
        disabled={isBusy || areAllWarm}
        onClick={handleWarmModels}
      >
        {areAllWarm ? "Models Ready" : isBusy ? "Warming..." : "Warm Models"}
      </Button>
    </Collapsible>
  );
};
