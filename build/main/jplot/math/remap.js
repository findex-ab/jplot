"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remap = void 0;
const remap = (value, originalMin, originalMax, nextMin, nextMax) => nextMin + (((value - originalMin) / (originalMax - originalMin)) * (nextMax - nextMin));
exports.remap = remap;
