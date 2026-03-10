import { initAiRuntime, runChat } from "../index";

initAiRuntime("desktop");

const prompt = "Explain closures in JavaScript in 3 short bullet points.";

const result = await runChat({
  prompt,
});

console.log("\n=== chat result (desktop) ===\n");
console.log(result.text);
console.log("\n===================\n");
