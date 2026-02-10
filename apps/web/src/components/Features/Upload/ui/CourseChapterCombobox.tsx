import type { Course } from "@hydrowise/entities";
import { useMemo } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

type CourseChapterComboboxProps = {
  courses: Course[];
  selectedCourseId: string | null;
  selectedChapterId: string | null;
  onCourseChange: (courseId: string | null) => void;
  onChapterChange: (chapterId: string | null) => void;
  disabled?: boolean;
};

export function CourseChapterCombobox({
  courses,
  selectedCourseId,
  selectedChapterId,
  onCourseChange,
  onChapterChange,
  disabled = false,
}: CourseChapterComboboxProps) {
  const courseOptions = useMemo(
    () =>
      courses.map((course) => ({
        id: course.id,
        label: `${course.name} (${course.number})`,
      })),
    [courses],
  );

  const selectedCourseLabel =
    courseOptions.find((option) => option.id === selectedCourseId)?.label ?? "";

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId,
  );

  const chapterOptions = useMemo(
    () =>
      (selectedCourse?.chapters ?? []).map((chapter) => ({
        id: chapter.id,
        label: chapter.title,
      })),
    [selectedCourse],
  );

  const selectedChapterLabel =
    chapterOptions.find((option) => option.id === selectedChapterId)?.label ??
    "";

  const chapterDisabled =
    disabled || !selectedCourse || chapterOptions.length === 0;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field>
        <FieldLabel>Course</FieldLabel>
        <FieldContent>
          <Combobox
            autoHighlight
            items={courseOptions.map((option) => option.label)}
            value={selectedCourseLabel}
            onValueChange={(nextValue) => {
              const nextCourse = courseOptions.find(
                (option) => option.label === nextValue,
              );

              onCourseChange(nextCourse?.id ?? null);
              onChapterChange(null);
            }}
            disabled={disabled}
          >
            <ComboboxInput className="w-full" placeholder="Select a course" />
            <ComboboxContent>
              <ComboboxEmpty>No courses found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Chapter</FieldLabel>
        <FieldContent>
          <Combobox
            autoHighlight
            items={chapterOptions.map((option) => option.label)}
            value={selectedChapterLabel}
            onValueChange={(nextValue) => {
              const nextChapter = chapterOptions.find(
                (option) => option.label === nextValue,
              );

              onChapterChange(nextChapter?.id ?? null);
            }}
            disabled={chapterDisabled}
          >
            <ComboboxInput
              className="w-full"
              placeholder={
                selectedCourse ? "Select a chapter" : "Select a course first"
              }
            />
            <ComboboxContent>
              <ComboboxEmpty>
                {selectedCourse
                  ? "No chapters available for this course."
                  : "Select a course first."}
              </ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </FieldContent>
      </Field>
    </div>
  );
}
