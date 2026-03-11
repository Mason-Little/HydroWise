import { Loader2Icon } from "lucide-react";

type Props = {
  activeModelLabel: string;
};

export const ModelWarmingIndicator = ({ activeModelLabel }: Props) => {
  return (
    <div className="mt-2 flex items-center gap-1.5 text-[11.5px] font-medium text-[var(--gold)]">
      <Loader2Icon className="size-[13px] animate-spin" />
      <span>
        Warming up -{" "}
        <strong className="text-[var(--text-secondary)]">
          {activeModelLabel}
        </strong>{" "}
        still active
      </span>
    </div>
  );
};
