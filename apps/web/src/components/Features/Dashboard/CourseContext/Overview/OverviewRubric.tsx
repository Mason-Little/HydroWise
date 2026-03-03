import { Card } from "@/components/ui/card";

const rubricItems = [
  { label: "Labs + Participation", value: "20%" },
  { label: "Quizzes", value: "15%" },
  { label: "Midterm Exam", value: "25%" },
  { label: "Final Exam", value: "30%" },
  { label: "Homework", value: "10%" },
];

export const OverviewRubric = () => {
  return (
    <Card
      className="gap-2 p-3 ring-0 border border-dashed"
      style={{ borderColor: "var(--hw-border)" }}
    >
      <p className="text-sm font-bold">Grading Rubric</p>
      <div className="flex flex-col gap-0.5">
        {rubricItems.map(({ label, value }) => (
          <div key={label} className="flex w-full items-center justify-between">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-sm font-bold">{value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
