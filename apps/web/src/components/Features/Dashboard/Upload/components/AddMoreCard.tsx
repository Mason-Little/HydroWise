import { PlusIcon } from "lucide-react";

interface AddMoreCardProps {
  onClick: () => void;
}

export const AddMoreCard = ({ onClick }: AddMoreCardProps) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="flex min-h-36 w-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-sm transition-colors"
    style={{
      borderColor: "var(--hw-border)",
      color: "var(--hw-muted)",
      backgroundColor: "var(--hw-surface)",
    }}
  >
    <PlusIcon className="size-4" />
    Add more
  </button>
);
