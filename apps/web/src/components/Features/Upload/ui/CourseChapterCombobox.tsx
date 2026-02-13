import type { Chapter, Course } from "@hydrowise/entities";
import { useMemo } from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { useChapters } from "@/hooks/query/chapter.queries";

type SharedCourseChapterComboboxProps = {
  courses: Course[];
  selectedCourse: Course | null;
  onCourseChange: (course: Course | null) => void;
  disabled?: boolean;
};

type SingleChapterComboboxProps = {
  chapterMultiSelect?: false;
  selectedChapter: Chapter | null;
  onChapterChange: (chapter: Chapter | null) => void;
  selectedChapters?: never;
  onChaptersChange?: never;
};

type MultiChapterComboboxProps = {
  chapterMultiSelect: true;
  selectedChapters: Chapter[];
  onChaptersChange: (chapters: Chapter[]) => void;
  selectedChapter?: never;
  onChapterChange?: never;
};

type CourseChapterComboboxProps = SharedCourseChapterComboboxProps &
  (SingleChapterComboboxProps | MultiChapterComboboxProps);

export function CourseChapterCombobox(props: CourseChapterComboboxProps) {
  const { courses, selectedCourse, onCourseChange, disabled = false } = props;
  const isMultiSelect = props.chapterMultiSelect === true;

  const courseOptions = useMemo(
    () =>
      courses.map((course) => ({
        id: course.id,
        label: `${course.name} (${course.number})`,
      })),
    [courses],
  );

  const selectedCourseLabel =
    courseOptions.find((option) => option.id === selectedCourse?.id)?.label ??
    "";

  const { chapters } = useChapters(selectedCourse?.id);

  const chapterOptions = useMemo(
    () =>
      chapters.map((chapter) => ({
        id: chapter.id,
        label: chapter.name,
      })),
    [chapters],
  );

  const selectedChapter = isMultiSelect ? null : props.selectedChapter;
  const selectedChapterIds = isMultiSelect
    ? props.selectedChapters.map((chapter) => chapter.id)
    : [];

  const selectedChapterLabel =
    chapterOptions.find((option) => option.id === selectedChapter?.id)?.label ??
    "";

  const selectedChapterLabels = chapterOptions
    .filter((option) => selectedChapterIds.includes(option.id))
    .map((option) => option.label);

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
              const nextCourseId = nextCourse?.id ?? null;
              const currentCourseId = selectedCourse?.id ?? null;

              if (nextCourseId === currentCourseId) {
                return;
              }

              onCourseChange(
                courses.find((course) => course.id === nextCourse?.id) ?? null,
              );

              if (isMultiSelect) {
                props.onChaptersChange([]);
                return;
              }

              props.onChapterChange(null);
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
          {isMultiSelect ? (
            <Combobox
              multiple
              autoHighlight
              items={chapterOptions.map((option) => option.label)}
              value={selectedChapterLabels}
              onValueChange={(nextValue) => {
                const nextLabels = Array.isArray(nextValue) ? nextValue : [];
                const nextChapters = nextLabels
                  .map((label) => {
                    const nextChapter = chapterOptions.find(
                      (option) => option.label === label,
                    );

                    return chapters.find(
                      (chapter) => chapter.id === nextChapter?.id,
                    );
                  })
                  .filter((chapter): chapter is Chapter => Boolean(chapter));

                const currentIds = selectedChapterIds;
                const nextIds = nextChapters.map((chapter) => chapter.id);
                const isSameSelection =
                  currentIds.length === nextIds.length &&
                  currentIds.every((id) => nextIds.includes(id));

                if (isSameSelection) {
                  return;
                }

                props.onChaptersChange(nextChapters);
              }}
              disabled={chapterDisabled}
            >
              <ComboboxChips>
                <ComboboxValue>
                  {(values) => (
                    <>
                      {values.map((value: string) => (
                        <ComboboxChip key={value}>{value}</ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        placeholder={
                          selectedCourse
                            ? "Select chapters"
                            : "Select a course first"
                        }
                        disabled={chapterDisabled}
                      />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>
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
          ) : (
            <Combobox
              autoHighlight
              items={chapterOptions.map((option) => option.label)}
              value={selectedChapterLabel}
              onValueChange={(nextValue) => {
                const nextChapter = chapterOptions.find(
                  (option) => option.label === nextValue,
                );
                const nextChapterId = nextChapter?.id ?? null;
                const currentChapterId = selectedChapter?.id ?? null;

                if (nextChapterId === currentChapterId) {
                  return;
                }

                props.onChapterChange(
                  chapters.find((chapter) => chapter.id === nextChapter?.id) ??
                    null,
                );
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
          )}
        </FieldContent>
      </Field>
    </div>
  );
}
