import type { Context } from "@hydrowise/entities";

export const contextToInjection = (context: Context[]): string => {
  const contextInjection = `
  ${context.map((c, index) => `<context id="${index + 1}"> ${c.content}</context>`).join("\n")}
  `;

  return contextInjection;
};
