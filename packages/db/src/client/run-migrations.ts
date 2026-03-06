import type { Db } from "@/types/db";

export type RunMigrationsFn = (db: Db) => Promise<void>;
