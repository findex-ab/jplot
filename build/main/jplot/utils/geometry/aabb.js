"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aabbVSPoint = void 0;
const aabbVSPoint = (bounds, point) => {
    if (point.x < bounds.min.x || point.x > bounds.max.x)
        return false;
    if (point.y < bounds.min.y || point.y > bounds.max.y)
        return false;
    return true;
};
exports.aabbVSPoint = aabbVSPoint;
