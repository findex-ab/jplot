import { VEC2, Vector } from "../../math/vector";

const gradient = (a: Vector, b: Vector) => {
  return (b.y - a.y) / (b.x - a.x);
};

export const createCurvePoints = (
  points: Vector[],
  f?: number,
  t?: number,
): Vector[] => {
  let nextPoints: Vector[] = [];
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
    } else {
      dx2 = 0;
      dy2 = 0;
    }

    nextPoints.push(VEC2(preP.x - dx1, preP.y - dy1));
    nextPoints.push(VEC2(curP.x + dx2, curP.y + dy2));
    nextPoints.push(VEC2(curP.x, curP.y));

    dx1 = dx2;
    dy1 = dy2;
    preP = curP;
  }

  return nextPoints;
};
