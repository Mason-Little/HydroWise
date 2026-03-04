import "dotenv/config";
import { Pool } from "pg";

const toPositiveInt = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const randInt = (min: number, max: number) => {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
};

const randomItem = <T>(items: T[]): T => {
  const index = randInt(0, items.length - 1);
  return items[index] as T;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const userId = process.env.SEED_USER_ID ?? "1";
const courseCount = toPositiveInt(process.env.SEED_COURSES, 6);
const minChaptersPerCourse = toPositiveInt(process.env.SEED_MIN_CHAPTERS, 4);
const maxChaptersPerCourse = toPositiveInt(process.env.SEED_MAX_CHAPTERS, 7);
const minDocsPerChapter = toPositiveInt(process.env.SEED_MIN_DOCS, 3);
const maxDocsPerChapter = toPositiveInt(process.env.SEED_MAX_DOCS, 7);

const courseTemplates = [
  {
    name: "Biology 101",
    number: "BIO-101",
    chapterTopics: [
      "Cell Structure",
      "Cell Cycle",
      "Genetics",
      "Evolution",
      "Photosynthesis",
      "Human Body Systems",
      "Ecology",
      "Molecular Biology",
    ],
  },
  {
    name: "Chemistry",
    number: "CHEM-110",
    chapterTopics: [
      "Atomic Structure",
      "Periodic Trends",
      "Chemical Bonding",
      "Stoichiometry",
      "Solutions",
      "Acids and Bases",
      "Thermochemistry",
      "Reaction Rates",
    ],
  },
  {
    name: "Physics",
    number: "PHYS-201",
    chapterTopics: [
      "Kinematics",
      "Newtonian Mechanics",
      "Work and Energy",
      "Momentum",
      "Waves",
      "Electricity",
      "Magnetism",
      "Optics",
    ],
  },
  {
    name: "Algebra II",
    number: "MATH-220",
    chapterTopics: [
      "Linear Functions",
      "Quadratic Functions",
      "Polynomials",
      "Rational Expressions",
      "Exponential Models",
      "Logarithms",
      "Sequences and Series",
      "Probability Review",
    ],
  },
  {
    name: "History",
    number: "HIST-150",
    chapterTopics: [
      "Early Civilizations",
      "Classical Empires",
      "Medieval World",
      "Renaissance",
      "Industrial Revolution",
      "World Wars",
      "Cold War",
      "Globalization",
    ],
  },
  {
    name: "English Lit",
    number: "ENG-210",
    chapterTopics: [
      "Poetry Fundamentals",
      "Shakespeare",
      "Romanticism",
      "Victorian Literature",
      "Modernism",
      "Contemporary Fiction",
      "Critical Analysis",
      "Research Writing",
    ],
  },
  {
    name: "Psychology",
    number: "PSY-101",
    chapterTopics: [
      "Research Methods",
      "Brain and Behavior",
      "Learning",
      "Memory",
      "Motivation",
      "Personality",
      "Psychological Disorders",
      "Treatment Approaches",
    ],
  },
  {
    name: "Computer Science",
    number: "CS-105",
    chapterTopics: [
      "Algorithms",
      "Data Structures",
      "Complexity",
      "Programming Paradigms",
      "Databases",
      "Networking",
      "Operating Systems",
      "Software Engineering",
    ],
  },
];

const docTypeTemplates = [
  { ext: "pdf", mimeType: "application/pdf", label: "Lecture" },
  {
    ext: "docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    label: "Study Guide",
  },
  {
    ext: "pptx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    label: "Slides",
  },
  { ext: "pdf", mimeType: "application/pdf", label: "Practice Sheet" },
  { ext: "pdf", mimeType: "application/pdf", label: "Reading" },
];

const pool = new Pool({ connectionString: databaseUrl });
const client = await pool.connect();

try {
  await client.query("BEGIN");

  await client.query(
    `insert into users (id, email)
     values ($1, $2)
     on conflict (id) do update
     set email = excluded.email`,
    [userId, `seed+${userId}@hydrowise.local`],
  );

  await client.query(
    `delete from document_embeddings where document_id like 'seed-term-%'`,
  );
  await client.query(`delete from documents where id like 'seed-term-%'`);
  await client.query(`delete from chapters where id like 'seed-term-%'`);
  await client.query(`delete from courses where id like 'seed-term-%'`);

  const selectedTemplates = courseTemplates.slice(0, courseCount);
  const termStart = new Date();
  termStart.setHours(0, 0, 0, 0);
  const termEnd = new Date(termStart);
  termEnd.setDate(termStart.getDate() + 120);

  let totalChapterCount = 0;
  let totalDocumentCount = 0;

  for (
    let courseIndex = 0;
    courseIndex < selectedTemplates.length;
    courseIndex += 1
  ) {
    const template = selectedTemplates[courseIndex];
    if (!template) continue;

    const courseId = `seed-term-course-${courseIndex + 1}`;
    const chapterCount = randInt(minChaptersPerCourse, maxChaptersPerCourse);

    await client.query(
      `insert into courses (id, user_id, name, number, start_date, end_date, status)
       values ($1, $2, $3, $4, $5, $6, $7::course_status)`,
      [
        courseId,
        userId,
        template.name,
        template.number,
        termStart,
        termEnd,
        "active",
      ],
    );

    for (
      let chapterOrder = 1;
      chapterOrder <= chapterCount;
      chapterOrder += 1
    ) {
      const chapterId = `${courseId}-chapter-${chapterOrder}`;
      const chapterTopic =
        template.chapterTopics[
          (chapterOrder - 1) % template.chapterTopics.length
        ];
      const chapterName = `Chapter ${chapterOrder}: ${chapterTopic}`;
      const docsForChapter = randInt(minDocsPerChapter, maxDocsPerChapter);

      await client.query(
        `insert into chapters (id, user_id, course_id, name, "order")
         values ($1, $2, $3, $4, $5)`,
        [chapterId, userId, courseId, chapterName, chapterOrder],
      );

      totalChapterCount += 1;

      for (let docOrder = 1; docOrder <= docsForChapter; docOrder += 1) {
        const docType = randomItem(docTypeTemplates);
        const documentId = `${chapterId}-doc-${docOrder}`;
        const docName = `${docType.label} ${String(docOrder).padStart(2, "0")} - ${chapterTopic}.${docType.ext}`;
        const fileSize = randInt(120_000, 8_000_000);

        await client.query(
          `insert into documents (
            id,
            user_id,
            course_id,
            chapter_id,
            name,
            mime_type,
            file_size,
            embedding_status
          ) values ($1, $2, $3, $4, $5, $6, $7, $8::embedding_status)`,
          [
            documentId,
            userId,
            courseId,
            chapterId,
            docName,
            docType.mimeType,
            fileSize,
            "completed",
          ],
        );

        totalDocumentCount += 1;
      }
    }
  }

  await client.query("COMMIT");

  console.log(
    `Seed complete: ${selectedTemplates.length} courses, ${totalChapterCount} chapters, ${totalDocumentCount} documents for user ${userId}`,
  );
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
