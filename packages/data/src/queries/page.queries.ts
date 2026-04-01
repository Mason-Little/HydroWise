import type { Db } from "@hydrowise/db";
import { pages } from "@hydrowise/db/schema";
import type { CreatePageInput } from "@hydrowise/entities";

export const makePageRepo = (db: Db) => {
  return {
    createPage: async (input: CreatePageInput) => {
      const [row] = await db.insert(pages).values(input).returning();
      return row;
    },
  };
};
