import { createDb } from "../src/client";
import { createCourse } from "../src/queries/courses";
import { createDocument } from "../src/queries/documents";

const DB_DIR = process.env.DB_URL ?? "./studio-db/";

function buildEmbedding(seed: number) {
  return Array.from({ length: 768 }, (_, i) =>
    Number((((seed + i) % 17) / 16).toFixed(6)),
  );
}

const { db, client } = await createDb(DB_DIR);

const courseA = await createCourse(db, {
  courseName: "Biology 101",
  courseCode: "BIO-101",
  gradeRubric: [
    { category: "Homework", weight: 0.4 },
    { category: "Exams", weight: 0.6 },
  ],
  testDates: [{ name: "Midterm", date: "2026-04-10" }],
  professorInformation: {
    professorName: "Dr. Rivera",
    professorEmail: "rivera@example.edu",
    professorOfficeHours: "10:00-12:00",
    professorOfficeDays: "Tuesday",
  },
});
const courseB = await createCourse(db, {
  courseName: "Physics 101",
  courseCode: "PHY-101",
  gradeRubric: [
    { category: "Labs", weight: 0.3 },
    { category: "Exams", weight: 0.7 },
  ],
  testDates: [{ name: "Final", date: "2026-06-02" }],
  professorInformation: {
    professorName: "Prof. Chen",
    professorEmail: "chen@example.edu",
    professorOfficeHours: "13:00-15:00",
    professorOfficeDays: "Thursday",
  },
});

await createDocument(db, {
  title: `${courseA.courseName} - Intro Notes`,
  content: "Cell structure and membrane transport overview.",
  embedding: buildEmbedding(1),
});

await createDocument(db, {
  title: `${courseB.courseName} - Kinematics`,
  content: "Displacement, velocity, acceleration, and motion graphs.",
  embedding: buildEmbedding(2),
});

await createDocument(db, {
  title: "Study Planning",
  content: "How to split revision sessions into focused 25-minute blocks.",
  embedding: buildEmbedding(3),
});

console.log("Seed complete.");
await client.close();
