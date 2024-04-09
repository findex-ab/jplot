export const remap = (
  value: number,
  originalMin: number,
  originalMax: number,
  nextMin: number,
  nextMax: number
): number => nextMin + (((value - originalMin) / (originalMax - originalMin)) * (nextMax - nextMin));
