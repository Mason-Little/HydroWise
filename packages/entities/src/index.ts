export type Message = {
  order: number;
  role: "assistant" | "user";
  content: string;
};
