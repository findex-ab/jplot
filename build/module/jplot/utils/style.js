export const remToPx = (rem) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
export const pxToRem = (px) => px / parseFloat(getComputedStyle(document.documentElement).fontSize);
export const pxToRemStr = (px) => `${pxToRem(px)}rem`;
