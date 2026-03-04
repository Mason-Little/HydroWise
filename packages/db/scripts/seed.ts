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

const courseA = await createCourse(db, { name: "Biology 101" });
const courseB = await createCourse(db, { name: "Physics 101" });

await createDocument(db, {
  title: `${courseA.name} - Intro Notes`,
  content: "Cell structure and membrane transport overview.",
  embedding: buildEmbedding(1),
});

await createDocument(db, {
  title: `${courseB.name} - Kinematics`,
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
