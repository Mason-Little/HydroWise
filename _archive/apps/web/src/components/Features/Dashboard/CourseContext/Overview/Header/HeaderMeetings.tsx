import { Card } from "@/components/ui/card";

export const HeaderMeetings = () => {
  return (
    <Card
      className="gap-1.5 p-3 ring-0 border border-dashed"
      style={{ borderColor: "var(--hw-border)" }}
    >
      <p className="text-sm font-semibold" style={{ color: "var(--hw-label)" }}>
        Class Meetings
      </p>
      <p className="text-lg font-bold">Mon &amp; Wed</p>
      <p className="text-sm text-muted-foreground">
        Start: 9:30 AM &nbsp;|&nbsp; End: 10:45 AM
      </p>
    </Card>
  );
};
