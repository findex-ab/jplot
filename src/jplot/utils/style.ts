export const remToPx = (rem: number) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
export const pxToRem = (px: number) => px / parseFloat(getComputedStyle(document.documentElement).fontSize);
export const pxToRemStr = (px: number):string => `${pxToRem(px)}rem`;
