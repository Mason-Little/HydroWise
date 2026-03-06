import { getQueries, type Queries } from "@hydrowise/data";
import { useEffect, useState } from "react";

type CourseRow = Awaited<ReturnType<Queries["listCourses"]>>[number];

export const CourseSelector = () => {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getQueries()
      .then((queries) => queries.listCourses())
      .then(setCourses)
      .catch((err) => setError(String(err?.message ?? err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="text-muted-foreground">Loading courses…</div>;
  if (error) return <div className="text-destructive">{error}</div>;
  if (courses.length === 0)
    return <div className="text-muted-foreground">No courses yet.</div>;

  return (
    <ul className="space-y-1">
      {courses.map((course) => (
        <li key={course.id} className="text-sm">
          {course.courseCode} — {course.courseName}
        </li>
      ))}
    </ul>
  );
};
