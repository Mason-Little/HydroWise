import { createDb } from "../src/client";
import { createChapter } from "../src/queries/chapters";
import { createChunk } from "../src/queries/chunks";
import { createCourse } from "../src/queries/courses";
import { createDocument } from "../src/queries/documents";
import { createTopic } from "../src/queries/topics";

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

const bioChapter = await createChapter(db, {
  courseId: courseA.id,
  chapterName: "Foundations of Cell Biology",
  chapterDescription:
    "Core biological principles focused on cells, membranes, and metabolism.",
});

const physicsChapter = await createChapter(db, {
  courseId: courseB.id,
  chapterName: "Intro to Motion",
  chapterDescription:
    "Fundamental motion concepts covering position, velocity, and acceleration.",
});

const membraneTopic = await createTopic(db, {
  chapterId: bioChapter.id,
  name: "Cell Membrane Transport",
  description:
    "Diffusion, osmosis, and active transport in cellular environments.",
});

const kinematicsTopic = await createTopic(db, {
  chapterId: physicsChapter.id,
  name: "Kinematics",
  description:
    "Displacement, velocity, acceleration, and interpretation of motion graphs.",
});

const bioDocument = await createDocument(db, {
  chapterId: bioChapter.id,
  topicId: membraneTopic.id,
  name: `${courseA.courseName} - Intro Notes.pdf`,
  fileType: "pdf",
});

const physicsDocument = await createDocument(db, {
  chapterId: physicsChapter.id,
  topicId: kinematicsTopic.id,
  name: `${courseB.courseName} - Kinematics.md`,
  fileType: "md",
});

const planningDocument = await createDocument(db, {
  chapterId: bioChapter.id,
  topicId: null,
  name: "Study Planning Guide.docx",
  fileType: "docx",
});

await createChunk(db, {
  documentId: bioDocument.id,
  chunkConcept: "Cell membrane",
  chunkContent:
    "The cell membrane is selectively permeable, regulating movement of substances into and out of the cell.",
  chunkEmbedding: buildEmbedding(1),
});

await createChunk(db, {
  documentId: bioDocument.id,
  chunkConcept: "Passive transport",
  chunkContent:
    "Passive transport moves substances down their concentration gradient without direct ATP use.",
  chunkEmbedding: buildEmbedding(2),
});

await createChunk(db, {
  documentId: bioDocument.id,
  chunkConcept: "Active transport",
  chunkContent:
    "Active transport uses membrane proteins and cellular energy to move molecules against concentration gradients.",
  chunkEmbedding: buildEmbedding(3),
});

await createChunk(db, {
  documentId: physicsDocument.id,
  chunkConcept: "Displacement",
  chunkContent:
    "Displacement measures the straight-line change in position from an initial point to a final point.",
  chunkEmbedding: buildEmbedding(4),
});

await createChunk(db, {
  documentId: physicsDocument.id,
  chunkConcept: "Velocity",
  chunkContent:
    "Velocity describes the rate of change of displacement with respect to time and includes direction.",
  chunkEmbedding: buildEmbedding(5),
});

await createChunk(db, {
  documentId: physicsDocument.id,
  chunkConcept: "Acceleration",
  chunkContent:
    "Acceleration quantifies how quickly velocity changes over time and can be positive, negative, or zero.",
  chunkEmbedding: buildEmbedding(6),
});

await createChunk(db, {
  documentId: planningDocument.id,
  chunkConcept: "Focused study blocks",
  chunkContent:
    "Use 25-minute focused sessions with short breaks to improve retention and reduce cognitive fatigue.",
  chunkEmbedding: buildEmbedding(7),
});

await createChunk(db, {
  documentId: planningDocument.id,
  chunkConcept: "Active recall",
  chunkContent:
    "Test yourself with short quizzes and flashcards to strengthen long-term memory and identify weak spots.",
  chunkEmbedding: buildEmbedding(8),
});

await createChunk(db, {
  documentId: planningDocument.id,
  chunkConcept: "Spaced repetition",
  chunkContent:
    "Revisit material across increasing intervals to reinforce understanding and reduce forgetting.",
  chunkEmbedding: buildEmbedding(9),
});

console.log(
  "Seed complete: 2 courses, 2 chapters, 2 topics, 3 documents, 9 chunks.",
);
await client.close();
