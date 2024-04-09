export const lerp = (start: number, end: number, scale: number) => {
  return start + scale * (end - start);
}
