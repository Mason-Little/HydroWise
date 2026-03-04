import type { Chapter } from "@hydrowise/entities";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { DocumentContainer } from "@/components/Features/Dashboard/CourseContext/Chapters/Documents/DocumentContainer";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ChapterDropdownProps {
  chapter: Chapter;
}

export const ChapterDropdown = ({ chapter }: ChapterDropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="flex w-full flex-col gap-2 rounded-xl border p-3 "
      style={{
        backgroundColor: "var(--hw-surface)",
        borderColor: "var(--hw-border)",
      }}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex h-10 w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <ChevronRight size={20} />
            </motion.span>
            <h1>{chapter.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <SparklesIcon size={16} />
              Quiz Chapter
            </Button>
          </div>
        </CollapsibleTrigger>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.2 },
              }}
              className="mt-2 overflow-hidden"
            >
              <DocumentContainer chapterId={chapter.id} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Collapsible>
    </div>
  );
};
