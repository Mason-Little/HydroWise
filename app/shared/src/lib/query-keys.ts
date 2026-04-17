export const courseKeys = {
  all: () => ["courses"] as const,
};

export const chapterKeys = {
  all: () => ["chapters"] as const,
  byCourse: (courseId: string) => ["chapters", courseId] as const,
};

export const topicKeys = {
  all: () => ["topics"] as const,
  byChapter: (chapterId: string) => ["topics", chapterId] as const,
  byCourse: (courseId: string) => ["topics", "byCourse", courseId] as const,
};

export const documentKeys = {
  all: () => ["documents"] as const,
  byCourse: (courseId: string) => ["documents", "byCourse", courseId] as const,
  byTopic: (topicId: string) => ["documents", "byTopic", topicId] as const,
};

export const chatKeys = {
  all: () => ["chat"] as const,
  threads: () => ["chat", "threads"] as const,
  messages: (threadId: string) => ["chat", "messages", threadId] as const,
};
