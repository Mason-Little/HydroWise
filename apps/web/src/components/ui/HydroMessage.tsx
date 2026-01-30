import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { Paper, Typography } from "@mui/material";

type Props = {
  message: ChatCompletionMessageParam;
};

const getMessageContent = (message: ChatCompletionMessageParam) => {
  if (typeof message.content === "string") return message.content;
  if (!message.content) return "";
  return message.content
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
};

export const HydroMessage = ({ message }: Props) => {
  const content = getMessageContent(message);

  return (
    <Paper elevation={1}>
      <Typography variant="body2">{content}</Typography>
    </Paper>
  );
};
