import { DocumentRouteSchema } from "@hydrowise/entities";

export { DocumentRouteSchema };

/** Tree of courses/chapters/topics sent to the model — no database IDs. */
export type CourseTree = {
  courseName: string;
  courseCode: string;
  chapters: {
    chapterName: string;
    chapterDescription: string;
    topics: {
      topicName: string;
      topicDescription: string;
    }[];
  }[];
}[];

export const documentRouterPrompt = (courseTree: CourseTree) => {
  const treeJson = JSON.stringify(courseTree, null, 2);

  return `
You are a document router. You receive page abstracts for a document and a JSON tree of existing courses, chapters, and topics. Your job is to output a JSON object matching the schema described below.

Existing course tree (use courseCode, chapterName, and topicName exactly as shown — do not invent values):
${treeJson}

Output schema (two possible shapes):

Shape A — course matched:
{
  "status": "ready",
  "title": "<short descriptive title for the document>",
  "description": "<one-sentence description of the document>",
  "courseCode": "<exact courseCode from tree>",
  "chapter": { "pick": "match", "chapterName": "<exact chapterName from tree>" }
           OR { "pick": "create", "chapter": { "chapterName": "<new name>", "chapterDescription": "<new description>" } },
  "topic":   { "pick": "match", "name": "<exact topicName from tree>" }
           OR { "pick": "create", "topic": { "name": "<new name>", "description": "<new description>" } }
}

Shape B — no course matched:
{
  "status": "unroutable",
  "reason": "no-course-match"
}

Rules:
1. Find the single best-matching course by comparing document content to courseName and courseCode. If any course is even a reasonable match, prefer Shape A.
2. If a matching course is found, set status to "ready" and courseCode to the exact value from the tree.
3. For chapter: find the best-matching chapter under the matched course. If one fits, use pick "match" with the exact chapterName. If none fit, use pick "create" with a new chapterName and chapterDescription.
4. For topic: find the best-matching topic under the matched chapter. If one fits, use pick "match" with the exact topicName as the name field. If none fit, use pick "create" with a new name and description.
5. If chapter pick is "create", topic pick must also be "create" (a topic cannot be matched inside a chapter that does not exist yet).
6. Only use Shape B (status "unroutable") when the document clearly does not belong to any course in the tree.

Use exact strings from the tree for all match fields — same spelling and casing as in the tree.
`.trim();
};
