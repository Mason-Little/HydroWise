import { Card } from "@/components/ui/card";

export const HeaderDates = () => {
  return (
    <Card
      className="gap-1.5 p-3 ring-0 border border-dashed"
      style={{ borderColor: "var(--hw-border)" }}
    >
      <p className="text-sm font-semibold" style={{ color: "var(--hw-label)" }}>
        Term Dates
      </p>
      <p className="text-lg font-bold">Aug 28 - Dec 12</p>
      <p className="text-sm text-muted-foreground">
        Final Exam: Dec 14, 10:00 AM
      </p>
    </Card>
  );
};
