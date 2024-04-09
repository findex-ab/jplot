import { Vector } from "../../math/vector";
export type AABB = {
    min: Vector;
    max: Vector;
};
export declare const aabbVSPoint: (bounds: AABB, point: Vector) => boolean;
