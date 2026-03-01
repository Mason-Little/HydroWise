const hashString = (value: string): number =>
  [...value].reduce((hash, char) => {
    const next = (hash ^ char.charCodeAt(0)) >>> 0;
    return Math.imul(next, 16777619) >>> 0;
  }, 2166136261);

const hsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;

export const titleToColour = (
  title: string,
): { selected: string; notSelected: string } => {
  const hash = hashString(title || "untitled");
  const hue = hash % 360;

  return {
    notSelected: hsl(hue, 40 + ((hash >>> 8) % 16), 84 + ((hash >>> 16) % 10)),
    selected: hsl(hue, 60 + ((hash >>> 8) % 15), 70 + ((hash >>> 16) % 10)),
  };
};
