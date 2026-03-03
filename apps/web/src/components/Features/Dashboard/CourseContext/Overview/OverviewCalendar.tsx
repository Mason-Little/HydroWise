import { Card } from "@/components/ui/card";

const examDates = [
  { date: "Sep 12", label: "Quiz 1 (Cell Structure)", time: "9:30 - 10:00 AM" },
  { date: "Oct 03", label: "Midterm Exam", time: "10:00 - 11:30 AM" },
  { date: "Nov 14", label: "Quiz 2 (Genetics)", time: "9:30 - 10:00 AM" },
  { date: "Dec 14", label: "Final Exam", time: "10:00 - 12:00 PM" },
];

export const OverviewCalendar = () => {
  return (
    <Card
      className="gap-2 p-3 ring-0 border border-dashed"
      style={{ borderColor: "var(--hw-border)" }}
    >
      <p className="text-sm font-bold">Tests, Quizzes, and Exams</p>
      <div className="flex flex-col gap-0.5">
        {examDates.map(({ date, label, time }) => (
          <div key={date} className="flex w-full items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {date} &nbsp;|&nbsp; {label}
            </p>
            <p className="text-sm font-bold">{time}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
