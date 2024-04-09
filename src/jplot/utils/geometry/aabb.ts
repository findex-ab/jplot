import { Vector } from "../../math/vector"

export type AABB = {
  min: Vector;
  max: Vector;
}

export const aabbVSPoint = (bounds: AABB, point: Vector): boolean => {
  if (point.x < bounds.min.x || point.x > bounds.max.x) return false;
  if (point.y < bounds.min.y || point.y > bounds.max.y) return false;
  return true;
}
