import {
  type QuizAttempt,
  QuizHistoryCard,
} from "@/components/Features/Dashboard/CourseContext/Quizzes/Quizzes/QuizHistoryCard";
import { Card } from "@/components/ui/card";

export const QuizzesAttempts = () => {
  const quizAttempts: QuizAttempt[] = [
    {
      title: "Cell Structure Quiz",
      score: 92,
      status: "Passed",
      date: new Date("2022-09-12"),
    },
    {
      title: "Microscopy Quiz",
      score: 78,
      status: "Passed",
      date: new Date("2022-09-18"),
    },
    {
      title: "Cell Cycle Checkpoint",
      score: 64,
      status: "Needs Review",
      date: new Date("2022-09-24"),
    },
    {
      title: "Genetics Fundamentals",
      score: 88,
      status: "Passed",
      date: new Date("2022-10-02"),
    },
    {
      title: "DNA Replication Quiz",
      score: 71,
      status: "Passed",
      date: new Date("2022-10-09"),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-3">
      <h2 className="font-semibold">Recent Attempts</h2>

      <Card className="gap-0 overflow-hidden rounded-md border bg-card py-0">
        <div className="flex w-full flex-col divide-y">
          {quizAttempts.map((attempt) => (
            <QuizHistoryCard
              key={`${attempt.title}-${attempt.date.toISOString()}`}
              attempt={attempt}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};
