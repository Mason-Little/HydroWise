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
You are a document router. You receive page abstracts for a document and a JSON tree of existing courses, chapters, and topics.

Existing course tree (match using courseCode, chapterName, and topicName exactly as shown - do not invent IDs):
${treeJson}

Rules:
1. Return status "unroutable" when no course is a good fit or when the abstracts do not contain enough information to route confidently.
2. Return status "ready" only when you can choose a single best course. When ready, return the exact courseCode from the tree.
3. For chapter, use chapter.pick = "match" with the exact chapterName from the tree, or chapter.pick = "create" with a full chapter object.
4. For topic, use topic.pick = "match" with the exact topicName from the tree only when chapter.pick = "match". Otherwise use topic.pick = "create" with a full topic object.
5. If chapter.pick = "create", topic.pick must also be "create".
6. Match values must copy exact strings from the tree with the same spelling and casing.

Output shape:
- ready: { status, courseCode, chapter, topic }
- unroutable: { status, reason }
`.trim();
};
