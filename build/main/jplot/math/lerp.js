"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerp = void 0;
const lerp = (start, end, scale) => {
    return start + scale * (end - start);
};
exports.lerp = lerp;
