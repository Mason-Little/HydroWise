import { createDbForPlatform } from "@/platform";
import { makeQueries } from "@/queries/makeQueries";

export type Queries = ReturnType<typeof makeQueries>;
type AppDb = Awaited<ReturnType<typeof createDbForPlatform>>;

type InitDataOptions = {
  platform: "web" | "desktop";
};

const NOT_INITIALIZED_ERROR =
  "@hydrowise/data not initialized. Call initData({ platform: ... }) during bootstrap.";

const state: {
  dbPromise: Promise<AppDb> | null;
  queriesPromise: Promise<Queries> | null;
} = {
  dbPromise: null,
  queriesPromise: null,
};

/**
 * Initialize data layer once; returns the query API.
 * Safe to call multiple times (e.g. React StrictMode).
 */
export const initData = (opts: InitDataOptions): Promise<Queries> => {
  if (!state.dbPromise) {
    state.dbPromise = createDbForPlatform(opts);
  }

  if (!state.queriesPromise) {
    state.queriesPromise = state.dbPromise.then((db) => makeQueries(db));
  }

  return state.queriesPromise;
};

/**
 * Returns the already-initialized queries, or throws if initData was never called.
 */
export const getQueries = async (): Promise<Queries> => {
  if (!state.queriesPromise) {
    throw new Error(NOT_INITIALIZED_ERROR);
  }

  return state.queriesPromise;
};

const getDb = async (): Promise<AppDb> => {
  if (!state.dbPromise) {
    throw new Error(NOT_INITIALIZED_ERROR);
  }

  return state.dbPromise;
};

export const dumpDbDataDir = async (): Promise<Uint8Array> => {
  const db = await getDb();
  const dump = await db.$client.dumpDataDir();
  const buffer = await dump.arrayBuffer();
  return new Uint8Array(buffer);
};
