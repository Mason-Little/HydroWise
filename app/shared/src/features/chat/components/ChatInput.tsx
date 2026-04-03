import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ChatInput = () => {
  const handleSend = () => {
    console.log("send");
  };

  return (
    <div>
      <Input
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />
      <Button onClick={handleSend}>Send</Button>
    </div>
  );
};
