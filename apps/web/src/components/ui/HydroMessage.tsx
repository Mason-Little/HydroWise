import type { Message } from "@hydrowise/entities";

type Props = {
  message: Message;
};

export const HydroMessage = ({ message }: Props) => {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/70 px-5 py-4 text-sm text-slate-700 shadow-[0_12px_28px_hsl(var(--glass-shadow))]">
      {message.content}
    </div>
  );
};
