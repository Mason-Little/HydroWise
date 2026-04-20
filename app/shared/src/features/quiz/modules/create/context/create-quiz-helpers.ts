import { getQueries, type Queries } from "@hydrowise/data";
import type {
  QuizPlannerChapter,
  QuizPlannerDocument,
  QuizPlannerTopic,
  QuizPlannerTree,
} from "@hydrowise/entities";
import type {
  CreateQuizScope,
  CreateQuizSelection,
} from "@/features/quiz/modules/create/context/create-quiz-context";

export const selectionLabelByScope = {
  course: "Full course",
  chapter: "Chapters",
  topic: "Topics",
  document: "Documents",
} as const;

const UNGROUPED_TOPIC_NAME = "Ungrouped";

type ScopedPageRow = Awaited<ReturnType<Queries["listPagesByCourse"]>>[number];

type TopicBucket = {
  topic: QuizPlannerTopic;
  documentBuckets: Map<string, QuizPlannerDocument>;
};

type ChapterBucket = {
  chapter: QuizPlannerChapter;
  topicBuckets: Map<string, TopicBucket>;
};

type QuizPlannerSelectionTree =
  | {
      chapters: QuizPlannerChapter[];
    }
  | {
      topics: QuizPlannerTopic[];
    }
  | {
      documents: QuizPlannerDocument[];
    };

const getOrCreate = <TValue>(
  map: Map<string, TValue>,
  key: string,
  createValue: () => TValue,
): TValue => {
  const existingValue = map.get(key);

  if (existingValue) {
    return existingValue;
  }

  const nextValue = createValue();
  map.set(key, nextValue);
  return nextValue;
};

export const createSelectionForScope = (
  scope: CreateQuizScope,
): CreateQuizSelection => {
  switch (scope) {
    case "course":
      return { scope: "course" };
    case "chapter":
      return { scope: "chapter", chapterIds: [] };
    case "topic":
      return { scope: "topic", topicIds: [] };
    case "document":
      return { scope: "document", documentIds: [] };
  }
};

export const toggleId = (ids: string[], id: string) =>
  ids.includes(id) ? ids.filter((currentId) => currentId !== id) : [...ids, id];

export const getSelectionCount = (selection: CreateQuizSelection) => {
  switch (selection.scope) {
    case "course":
      return 1;
    case "chapter":
      return selection.chapterIds.length;
    case "topic":
      return selection.topicIds.length;
    case "document":
      return selection.documentIds.length;
  }
};

export const getSelectionSummary = (
  selection: CreateQuizSelection,
  canCreate: boolean,
) => {
  if (canCreate) {
    return `${selectionLabelByScope[selection.scope]} selected. Ready to create a quiz draft.`;
  }

  return "Select at least one item for the current scope before creating a quiz.";
};

const loadManyScopedPageRows = (
  ids: string[],
  loadRows: (id: string) => Promise<ScopedPageRow[]>,
): Promise<ScopedPageRow[]> =>
  Promise.all(ids.map(loadRows)).then((rows) => rows.flat());

const loadScopedPageRows = async (
  selection: CreateQuizSelection,
  courseId: string,
): Promise<ScopedPageRow[]> => {
  const queries = await getQueries();

  switch (selection.scope) {
    case "course":
      return queries.listPagesByCourse(courseId);
    case "chapter":
      return loadManyScopedPageRows(
        selection.chapterIds,
        queries.listPagesByChapter,
      );
    case "topic":
      return loadManyScopedPageRows(selection.topicIds, queries.listPagesByTopic);
    case "document":
      return loadManyScopedPageRows(
        selection.documentIds,
        queries.listPagesByDocument,
      );
  }
};

const groupScopedPageRows = (rows: ScopedPageRow[]): QuizPlannerTree => {
  const sortedRows = [...rows].sort((left, right) => {
    const chapterComparison = left.chapterName.localeCompare(right.chapterName);
    if (chapterComparison !== 0) {
      return chapterComparison;
    }

    const topicComparison = (left.topicName ?? "Ungrouped").localeCompare(
      right.topicName ?? "Ungrouped",
    );
    if (topicComparison !== 0) {
      return topicComparison;
    }

    const documentComparison = left.documentName.localeCompare(right.documentName);
    if (documentComparison !== 0) {
      return documentComparison;
    }

    return left.pageNumber - right.pageNumber;
  });

  const chapterBuckets = new Map<string, ChapterBucket>();

  for (const row of sortedRows) {
    const chapterBucket = getOrCreate(chapterBuckets, row.chapterId, () => ({
      chapter: {
        chapterName: row.chapterName,
        description: row.chapterDescription,
        topics: [] as QuizPlannerChapter["topics"],
      },
      topicBuckets: new Map(),
    }));

    const topicKey = row.topicId ?? `${row.chapterId}:ungrouped`;
    const topicBucket = getOrCreate(chapterBucket.topicBuckets, topicKey, () => {
      const nextTopicBucket = {
        topic: {
          name: row.topicName ?? UNGROUPED_TOPIC_NAME,
          description: row.topicDescription ?? "",
          documents: [] as QuizPlannerTopic["documents"],
        },
        documentBuckets: new Map(),
      };

      chapterBucket.chapter.topics.push(nextTopicBucket.topic);
      return nextTopicBucket;
    });

    const documentBucket = getOrCreate(
      topicBucket.documentBuckets,
      row.documentId,
      () => {
        const nextDocumentBucket: QuizPlannerDocument = {
          name: row.documentName,
          description: row.documentDescription,
          pageAbstracts: [],
        };

        topicBucket.topic.documents.push(nextDocumentBucket);
        return nextDocumentBucket;
      },
    );

    documentBucket.pageAbstracts.push({
      pageNumber: row.pageNumber,
      abstract: row.abstract,
    });
  }

  return {
    chapters: Array.from(chapterBuckets.values(), ({ chapter }) => chapter),
  };
};

const scopeQuizPlannerTree = (
  tree: QuizPlannerTree,
  selection: CreateQuizSelection,
): QuizPlannerSelectionTree => {
  switch (selection.scope) {
    case "course":
    case "chapter":
      return tree;
    case "topic":
      return {
        topics: tree.chapters.flatMap((chapter) => chapter.topics),
      };
    case "document":
      return {
        documents: tree.chapters.flatMap((chapter) =>
          chapter.topics.flatMap((topic) => topic.documents),
        ),
      };
  }
};

export const buildQuizPlannerTree = async (
  selection: CreateQuizSelection,
  courseId: string,
) => {
  const rows = await loadScopedPageRows(selection, courseId);
  return scopeQuizPlannerTree(groupScopedPageRows(rows), selection);
};
