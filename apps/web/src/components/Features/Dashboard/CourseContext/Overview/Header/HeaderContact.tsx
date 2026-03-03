import { Card } from "@/components/ui/card";

export const HeaderContact = () => {
  return (
    <Card
      className="gap-1.5 p-3 ring-0 border border-dashed"
      style={{ borderColor: "var(--hw-border)" }}
    >
      <p className="text-sm font-semibold" style={{ color: "var(--hw-label)" }}>
        Class + Contact
      </p>
      <p className="text-lg font-bold">Science Hall 204</p>
      <p className="text-sm text-muted-foreground">
        Dr. Rivera &nbsp;|&nbsp; rivera@univ.edu
      </p>
    </Card>
  );
};
