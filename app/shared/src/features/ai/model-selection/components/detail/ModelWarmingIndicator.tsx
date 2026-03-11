import { Loader2Icon } from "lucide-react";

type Props = {
  activeModelLabel: string;
};

export const ModelWarmingIndicator = ({ activeModelLabel }: Props) => {
  return (
    <div className="mt-2 flex items-center gap-1.5 text-[length:var(--font-size-sm)] font-medium text-[var(--gold)]">
      <Loader2Icon className="size-[var(--size-icon-sm)] animate-spin" />
      <span>
        Warming up -{" "}
        <strong className="text-muted-foreground">
          {activeModelLabel}
        </strong>{" "}
        still active
      </span>
    </div>
  );
};
