import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadFile } from "../UploadFile";

export const UploadFileButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="h-9 px-3 font-semibold text-[#1f2328] border-border bg-transparent shadow-none"
        onClick={() => setOpen(true)}
      >
        Upload
      </Button>
      <UploadFile open={open} onOpenChange={setOpen} />
    </>
  );
};
