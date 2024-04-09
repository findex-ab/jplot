export const remap = (value, originalMin, originalMax, nextMin, nextMax) => nextMin + (((value - originalMin) / (originalMax - originalMin)) * (nextMax - nextMin));
