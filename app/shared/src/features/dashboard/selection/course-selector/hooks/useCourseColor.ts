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
    },
    active: {
      backgroundColor: `hsl(${hue}, 55%, 72%)`,
    },
  };
}
