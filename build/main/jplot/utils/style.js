"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pxToRemStr = exports.pxToRem = exports.remToPx = void 0;
const remToPx = (rem) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
exports.remToPx = remToPx;
const pxToRem = (px) => px / parseFloat(getComputedStyle(document.documentElement).fontSize);
exports.pxToRem = pxToRem;
const pxToRemStr = (px) => `${(0, exports.pxToRem)(px)}rem`;
exports.pxToRemStr = pxToRemStr;
