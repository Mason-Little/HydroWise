import { MonitorIcon } from "lucide-react";

export const ModelDesktopNotice = () => {
  return (
    <div className="mt-2 flex items-center gap-2 rounded-sm bg-muted px-2.5 py-1.5 text-[length:var(--font-size-sm)] font-medium text-muted-foreground">
      <MonitorIcon className="size-[var(--size-icon-sm)]" />
      <span>Available in the desktop app</span>
    </div>
  );
};
