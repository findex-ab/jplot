"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCurvePoints = void 0;
const vector_1 = require("../../math/vector");
const gradient = (a, b) => {
    return (b.y - a.y) / (b.x - a.x);
};
const createCurvePoints = (points, f, t) => {
    let nextPoints = [];
    f = f || 0.3;
    t = t || 0.6;
    let m = 0;
    let dx1 = 0;
    let dy1 = 0;
    let dx2 = 0;
    let dy2 = 0;
    var preP = points[0];
    for (var i = 1; i < points.length; i++) {
        var curP = points[i];
        const nexP = points[i + 1];
        if (nexP) {
            m = gradient(preP, nexP);
            dx2 = (nexP.x - curP.x) * -f;
            dy2 = dx2 * m * t;
        }
        else {
            dx2 = 0;
            dy2 = 0;
        }
        nextPoints.push((0, vector_1.VEC2)(preP.x - dx1, preP.y - dy1));
        nextPoints.push((0, vector_1.VEC2)(curP.x + dx2, curP.y + dy2));
        nextPoints.push((0, vector_1.VEC2)(curP.x, curP.y));
        dx1 = dx2;
        dy1 = dy2;
        preP = curP;
    }
    return nextPoints;
};
exports.createCurvePoints = createCurvePoints;
