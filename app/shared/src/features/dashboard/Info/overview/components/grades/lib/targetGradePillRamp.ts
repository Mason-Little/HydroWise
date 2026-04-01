type TargetPillRampStyle = {
  active: { backgroundColor: string; borderColor: string; color: string };
  idle: { backgroundColor: string; borderColor: string; color: string };
};

const TARGET_GRADE_PILL_RAMP: readonly TargetPillRampStyle[] = [
  {
    idle: {
      backgroundColor: "#f7dfdc",
      borderColor: "#e8bbb4",
      color: "#7a564f",
    },
    active: {
      backgroundColor: "#efc9c3",
      borderColor: "#dca199",
      color: "#6f4b46",
    },
  },
  {
    idle: {
      backgroundColor: "#f8e5df",
      borderColor: "#ebc7bc",
      color: "#795c53",
    },
    active: {
      backgroundColor: "#f0d1c8",
      borderColor: "#ddb0a3",
      color: "#6f5148",
    },
  },
  {
    idle: {
      backgroundColor: "#f9ebe1",
      borderColor: "#ecd1bf",
      color: "#796253",
    },
    active: {
      backgroundColor: "#f2dacb",
      borderColor: "#e0baaa",
      color: "#6e5849",
    },
  },
  {
    idle: {
      backgroundColor: "#f8efdf",
      borderColor: "#eadab8",
      color: "#77684f",
    },
    active: {
      backgroundColor: "#f0dfc6",
      borderColor: "#ddc3a0",
      color: "#6d5b47",
    },
  },
  {
    idle: {
      backgroundColor: "#f3efd9",
      borderColor: "#e1d8ab",
      color: "#6f694a",
    },
    active: {
      backgroundColor: "#e8e0be",
      borderColor: "#d2c592",
      color: "#655d41",
    },
  },
  {
    idle: {
      backgroundColor: "#eaf1da",
      borderColor: "#d0dbab",
      color: "#5f6947",
    },
    active: {
      backgroundColor: "#dce7bb",
      borderColor: "#bdd08c",
      color: "#56603d",
    },
  },
  {
    idle: {
      backgroundColor: "#e2f0db",
      borderColor: "#bfd6b1",
      color: "#526848",
    },
    active: {
      backgroundColor: "#d2e6c2",
      borderColor: "#a8c58f",
      color: "#4b5f40",
    },
  },
  {
    idle: {
      backgroundColor: "#dcefd9",
      borderColor: "#b2d2af",
      color: "#486847",
    },
    active: {
      backgroundColor: "#cbe4be",
      borderColor: "#9fbe8b",
      color: "#43603e",
    },
  },
  {
    idle: {
      backgroundColor: "#d7edd7",
      borderColor: "#a6cba8",
      color: "#406744",
    },
    active: {
      backgroundColor: "#c3e0bc",
      borderColor: "#93b786",
      color: "#3d5f3d",
    },
  },
] as const;

const RAMP_LAST_INDEX = TARGET_GRADE_PILL_RAMP.length - 1;

const rampIndexForGoalTile = (index: number, tileCount: number): number => {
  if (tileCount <= 0) return 0;
  if (tileCount === 1) return RAMP_LAST_INDEX;

  return Math.round((index / (tileCount - 1)) * RAMP_LAST_INDEX);
};

export const pillRampForGoalTile = (
  index: number,
  tileCount: number,
): Readonly<TargetPillRampStyle> => {
  const i = rampIndexForGoalTile(index, tileCount);
  const clamped = Math.min(Math.max(0, i), RAMP_LAST_INDEX);
  return TARGET_GRADE_PILL_RAMP[clamped];
};
