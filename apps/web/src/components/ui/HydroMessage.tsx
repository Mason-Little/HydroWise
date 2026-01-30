import type { Message } from "@hydrowise/entities";
import { Paper, Typography } from "@mui/material";

type Props = {
  message: Message;
};

export const HydroMessage = ({ message }: Props) => {
  return (
    <Paper elevation={1}>
      <Typography variant="body2">{message.content}</Typography>
    </Paper>
  );
};
