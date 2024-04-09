import { clamp } from "../../math/clamp";
const gradient = (a, b) => {
    return (b.y - a.y) / (b.x - a.x);
};
export const bzCurve = (ctx, points, f, t) => {
    f = f || 0.3;
    t = t || 0.6;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    let m = 0;
    let dx1 = 0;
    let dy1 = 0;
    let dx2 = 0;
    let dy2 = 0;
    var preP = points[0];
    for (var i = 1; i < points.length; i++) {
        var curP = points[i];
        let nexP = curP;
        if (i < points.length - 1) {
            nexP = points[i + 1];
            m = gradient(preP, nexP);
            dx2 = (nexP.x - curP.x) * -f;
            dy2 = dx2 * m * t;
        }
        else {
            dx2 = 0;
            dy2 = 0;
        }
        ctx.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);
        dx1 = dx2;
        dy1 = dy2;
        preP = curP;
    }
    ctx.closePath();
};
export const lineSegments = (ctx, points) => {
    for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const b = points[clamp(i + 1, 0, points.length - 1)];
        ctx.beginPath();
        ctx.moveTo(...a.xy);
        ctx.lineTo(...b.xy);
        ctx.closePath();
        ctx.stroke();
    }
};
export const lineSegment = (ctx, points) => {
    ctx.beginPath();
    ctx.moveTo(...points[0].xy);
    for (let i = 0; i < points.length; i++) {
        const b = points[clamp(i + 1, 0, points.length - 1)];
        ctx.lineTo(...b.xy);
    }
    ctx.closePath();
};
