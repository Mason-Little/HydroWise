import { ArrowUpIcon, PaperclipIcon } from "lucide-react";
import { type KeyboardEvent, type SyntheticEvent, useState } from "react";
import { UploadFile } from "@/components/Features/Upload/UploadFile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const trimmedValue = value.trim();
  const isDisabled = trimmedValue.length === 0 || disabled;

  const setOpenUploadFile = (open: boolean) => {
    setOpen(open);
  };

  const handleSend = () => {
    if (isDisabled) {
      return;
    }

    onSend(trimmedValue);
    setValue("");
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSend();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <form className="bg-card/50 px-4 py-4 md:px-5" onSubmit={handleSubmit}>
        <div className="relative">
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-xl shadow-sm"
            onClick={() => setOpen(true)}
            aria-label="Upload a file"
          >
            <PaperclipIcon className="size-4" />
          </Button>
          <Textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask HydroWise a question..."
            className="max-h-40 min-h-12 rounded-2xl pl-12 pr-12 text-sm shadow-sm"
          />
          <Button
            type="submit"
            size="icon-sm"
            className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-xl"
            disabled={isDisabled}
            aria-label="Send message"
          >
            <ArrowUpIcon className="size-4" />
          </Button>
        </div>
      </form>
      <UploadFile open={open} onOpenChange={setOpenUploadFile} />
    </>
  );
};
