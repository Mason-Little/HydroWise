import { sendCreateCourse } from "@hydrowise/llm-client";
import { courseAPI } from "@/api/course/course";
import { topicApi } from "@/api/topic/topic";

export const uploadSyllabus = async (
  _file: File,
  syllabusText: string,
): Promise<void> => {
  // 1. Extract structured course data from the syllabus text via LLM
  const courseData = await sendCreateCourse(syllabusText);

  // 2. Create the course record via the API
  const course = await courseAPI.createCourse({
    name: courseData.courseName,
    number: courseData.courseNumber,
    startDate: new Date(courseData.term.startDate),
    endDate: new Date(courseData.term.endDate),
  });

  // 3. Create a topic for each extracted course topic
  await Promise.all(
    courseData.courseTopics.map((topic) =>
      topicApi.createTopic({
        name: topic.name,
        description: topic.description,
        courseId: course.id,
      }),
    ),
  );
};
