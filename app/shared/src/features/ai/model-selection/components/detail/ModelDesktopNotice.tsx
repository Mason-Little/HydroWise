import { MonitorIcon } from "lucide-react";

export const ModelDesktopNotice = () => {
  return (
    <div className="mt-2 flex items-center gap-[7px] rounded-[var(--hw-radius-sm)] bg-[var(--surface-alt)] px-[10px] py-[7px] text-[11.5px] font-medium text-[var(--text-muted)]">
      <MonitorIcon className="size-[13px]" />
      <span>Available in the desktop app</span>
    </div>
  );
};
