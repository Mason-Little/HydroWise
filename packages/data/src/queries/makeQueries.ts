import type { Db } from "@hydrowise/db";
import { makeChapterRepo } from "@/queries/chapter.queries";
import { makeChatMessageRepo } from "@/queries/chat-message.queries";
import { makeChatThreadRepo } from "@/queries/chat-thread.queries";
import { makeCourseRepo } from "@/queries/course.queries";
import { makeDocumentRepo } from "@/queries/document.queries";
import { makePageRepo } from "@/queries/page.queries";
import { makeTopicRepo } from "@/queries/topic.queries";

export const makeQueries = (db: Db) => {
  const courses = makeCourseRepo(db);
  const chapters = makeChapterRepo(db);
  const topics = makeTopicRepo(db);
  const documents = makeDocumentRepo(db);
  const pages = makePageRepo(db);
  const chatThreads = makeChatThreadRepo(db);
  const chatMessages = makeChatMessageRepo(db);
  return {
    listCourses: courses.listCourses,
    getCourse: courses.getCourse,
    createCourse: courses.createCourse,
    updateProfessorInformation: courses.updateProfessorInformation,
    updateCourseDetails: courses.updateCourseDetails,
    updateGradePlannerState: courses.updateGradePlannerState,
    updateCourseTodos: courses.updateCourseTodos,
    listChapters: chapters.listChapters,
    listChaptersByCourse: chapters.listChaptersByCourse,
    createChapter: chapters.createChapter,
    listTopics: topics.listTopics,
    listTopicsByChapter: topics.listTopicsByChapter,
    listTopicsByCourse: topics.listTopicsByCourse,
    createTopic: topics.createTopic,
    listDocuments: documents.listDocuments,
    listDocumentsByTopic: documents.listDocumentsByTopic,
    createDocument: documents.createDocument,
    getPage: pages.getPage,
    getPageById: pages.getPageById,
    searchPages: pages.searchPages,
    createPage: pages.createPage,
    listChatThreads: chatThreads.listChatThreads,
    createChatThread: chatThreads.createChatThread,
    patchChatThread: chatThreads.patchChatThread,
    deleteChatThread: chatThreads.deleteChatThread,
    listChatMessages: chatMessages.listChatMessages,
    createChatMessage: chatMessages.createChatMessage,
  };
};
