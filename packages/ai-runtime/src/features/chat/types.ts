export type ChatRunInput = {
  prompt: string;
};

export type ChatRunResult = {
  text: string;
};

export type ChatRunStreamResult = {
  textStream: AsyncIterable<string>;
};
