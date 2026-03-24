import type { Db } from "@hydrowise/db";
import { pages } from "@hydrowise/db/schema";
import type { CreatePageInput } from "@hydrowise/entities";

export const makePageRepo = (db: Db) => {
  return {
    createPage: async (inputs: CreatePageInput[]) => {
      return db.insert(pages).values(inputs).returning();
    },
  };
};
