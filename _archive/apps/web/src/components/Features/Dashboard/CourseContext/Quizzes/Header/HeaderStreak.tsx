import { Card } from "@/components/ui/card";

export const HeaderStreak = () => {
  return (
    <Card
      className="gap-1.5 p-3 ring-0 border border-dashed"
      style={{ borderColor: "var(--hw-border)" }}
    >
      <p className="text-sm font-semibold" style={{ color: "var(--hw-label)" }}>
        Current Streak
      </p>
      <p className="text-2xl font-bold">3 days</p>
    </Card>
  );
};
