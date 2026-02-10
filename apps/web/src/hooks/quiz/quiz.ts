import { sendQuiz } from "@hydrowise/llm-client";
import { convertTextToMessage } from "@/lib/prompt/text-to-message";

export const useQuiz = () => {
  const generateQuiz = async (documentChunks: string[]) => {
    const message = convertTextToMessage(documentChunks.join("\n"), "user");
    console.log(message);
    const quiz = await sendQuiz(message);
    return quiz;
  };

  return { generateQuiz };
};
