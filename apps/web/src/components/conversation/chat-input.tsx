import { ArrowUpIcon } from "lucide-react";
import { type KeyboardEvent, type SyntheticEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatInputProps = {
  onSend: (message: string) => void;
};

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const trimmedValue = value.trim();
  const isDisabled = trimmedValue.length === 0;

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
    <form className="bg-card/50 px-4 py-4 md:px-5" onSubmit={handleSubmit}>
      <div className="relative">
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask HydroWise a question..."
          className="max-h-40 min-h-12 rounded-2xl pr-12 text-sm shadow-sm"
        />
        <Button
          type="submit"
          size="icon-sm"
          className="absolute right-2 bottom-2 rounded-xl"
          disabled={isDisabled}
          aria-label="Send message"
        >
          <ArrowUpIcon className="size-4" />
        </Button>
      </div>
    </form>
  );
};
