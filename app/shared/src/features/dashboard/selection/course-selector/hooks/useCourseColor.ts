function hashCourseCode(code: string): number {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function useCourseColor(courseCode: string) {
  const hue = hashCourseCode(courseCode);
  return {
    inactive: {
      backgroundColor: `hsl(${hue}, 45%, 88%)`,
      color: `hsl(${hue}, 35%, 30%)`,
      border: `1px solid hsl(${hue}, 45%, 80%)`,
      boxShadow: `0 1px 3px hsl(${hue}, 30%, 70%, 0.25)`,
    },
    active: {
      backgroundColor: `hsl(${hue}, 55%, 72%)`,
      border: `1px solid hsl(${hue}, 55%, 65%)`,
      boxShadow: `0 1px 3px hsl(${hue}, 40%, 55%, 0.3)`,
    },
  };
}
