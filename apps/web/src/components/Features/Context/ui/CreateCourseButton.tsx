import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateCourseDialog } from "./CreateCourseDialog";

export const CreateCourseButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="h-9 border border-black/10 bg-[#c4d5ff] px-3 font-semibold text-[#1f2a4a] shadow-none hover:bg-[#b4c5ef]"
        onClick={() => setOpen(true)}
      >
        Create Course
      </Button>
      <CreateCourseDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
