import { extractSyllabus } from "@hydrowise/ai-runtime";
import { getQueries } from "@hydrowise/data";

export const handleSyllabus = async (texts: string[]) => {
  const { createCourse, createChapter } = await getQueries();

  const fullSyllabus = texts.join("\n");

  const { chapters, ...courseInformation } =
    await extractSyllabus(fullSyllabus);

  const course = await createCourse(courseInformation);

  await Promise.all(
    chapters.map((chapter) =>
      createChapter({ ...chapter, courseId: course.id }),
    ),
  );
};
