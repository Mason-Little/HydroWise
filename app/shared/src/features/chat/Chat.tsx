import { sendGroundedChat } from "@hydrowise/ai-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Chat = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<any>(null);
  const handleSend = async () => {
    const result = await sendGroundedChat(input);
    setOutput(result);
  };

  return (
    <div>
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button onClick={handleSend} type="submit">
        Send
      </Button>
      <div>
        {output !== null && (
          <pre>
            {typeof output === "string"
              ? output
              : JSON.stringify(output, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
