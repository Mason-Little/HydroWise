import { format } from "date-fns";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCourses } from "@/hooks/query/course.quires";

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// TODO: move to config
const courseNames: Record<string, string> = {
  Accounting: "ACCT",
  Anthropology: "ANTH",
  "Art History": "ARTH",
  Biology: "BIOL",
  Business: "BUSN",
  Chemistry: "CHEM",
  Communications: "CMNS",
  "Computer Science": "CPSC",
  Criminology: "CRIM",
  Economics: "ECON",
  Education: "EDUC",
  Engineering: "ENGR",
  English: "ENGL",
  "Environmental Science": "ENVS",
  "Film Studies": "FILM",
  Finance: "FINC",
  Geography: "GEOG",
  "Health Sciences": "HSCI",
  History: "HIST",
  "Human Resources Management": "HRMT",
  Journalism: "JOUR",
  Kinesiology: "KINE",
  Linguistics: "LING",
  Marketing: "MARK",
  Mathematics: "MATH",
  Music: "MUSC",
  Nursing: "NURS",
  Philosophy: "PHIL",
  Physics: "PHYS",
  "Political Science": "POLS",
  Psychology: "PSYC",
  Sociology: "SOCI",
  Statistics: "STAT",
  Theatre: "THTR",
};

export const CreateCourseDialog = ({
  open,
  onOpenChange,
}: CreateCourseDialogProps) => {
  const [courseName, setCourseName] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [chapters, setChapters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [chapterInput, setChapterInput] = useState<string>("");

  const { createCourse } = useCourses();

  const handleCreateCourse = () => {
    const startDate = dateRange?.from;
    const endDate = dateRange?.to;

    if (!courseName || !courseCode || !startDate || !endDate) {
      return;
    }

    const course = {
      name: courseName,
      number: courseCode,
      chapters,
      startDate,
      endDate,
    };

    createCourse(course);
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    onOpenChange(false);
    setCourseName("");
    setCourseCode("");
    setChapters([]);
    setDateRange(undefined);
    setDateRangeOpen(false);
    setChapterInput("");
  };

  const handleCalenderSubmit = () => {
    setDateRangeOpen(false);
  };

  const handleCreateChapter = () => {
    const nextChapter = chapterInput.trim();
    if (!nextChapter) return;

    setChapters((prev) =>
      prev.includes(nextChapter) ? prev : [...prev, nextChapter],
    );
    setChapterInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent initialFocus={false} className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
          <DialogDescription>
            Create a new course and a optional Chapters. You can always add more
            later :)
          </DialogDescription>
        </DialogHeader>
        <Card className="space-y-5 p-4 sm:p-5">
          <Field>
            <FieldLabel>Course Name</FieldLabel>
            <FieldContent className="gap-2 sm:flex-row sm:items-center">
              <Combobox
                autoHighlight
                items={Object.keys(courseNames)}
                onInputValueChange={setCourseName}
              >
                <ComboboxInput
                  className="w-full"
                  placeholder="Select a course"
                />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item} - {courseNames[item]}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <InputOTP
                maxLength={3}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                onChange={setCourseCode}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
              </InputOTP>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Chapters</FieldLabel>
            <FieldContent>
              <Combobox
                multiple
                items={chapters}
                value={chapters}
                onValueChange={(values) => setChapters(values as string[])}
              >
                <ComboboxChips>
                  <ComboboxValue>
                    {(values) => (
                      <>
                        {values.map((value: string) => (
                          <ComboboxChip key={value}>{value}</ComboboxChip>
                        ))}
                        <ComboboxChipsInput
                          value={chapterInput}
                          onChange={(e) => setChapterInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === ",") {
                              e.preventDefault();
                              handleCreateChapter();
                            }
                          }}
                          placeholder="Type chapter name"
                        />
                      </>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
              </Combobox>
              <Button
                type="button"
                variant="outline"
                className="mt-2 w-full sm:w-fit"
                disabled={!chapterInput.trim()}
                onClick={handleCreateChapter}
              >
                Add chapter
              </Button>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Course Dates</FieldLabel>
            <FieldContent>
              <Popover open={dateRangeOpen} onOpenChange={setDateRangeOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      data-empty={!dateRange}
                      className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                      <CalendarIcon />
                      {dateRange?.from && dateRange?.to ? (
                        <>
                          {format(dateRange.from, "MMM d, yyyy")} -{" "}
                          {format(dateRange.to, "MMM d, yyyy")}
                        </>
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  }
                >
                  <CalendarIcon />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    defaultMonth={new Date()}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={3}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDateRange(undefined);
                        setDateRangeOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCalenderSubmit}>Submit</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </FieldContent>
          </Field>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              autoFocus
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCourse}>Submit</Button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
