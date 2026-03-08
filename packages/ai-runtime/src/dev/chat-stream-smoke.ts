import { runChatStream } from "../index";

const prompt = "Explain closures in JavaScript in 3 short bullet points.";

const result = await runChatStream({
  prompt,
});

console.log("\n=== chat stream ===\n");
for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
console.log("\n===================\n");
