export interface IVector {
    x: number;
    y: number;
    z?: number;
    w?: number;
}
export declare class Vector implements IVector {
    _x: number;
    _y: number;
    _z?: number;
    _w?: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    get x(): number;
    get y(): number;
    get z(): number;
    get w(): number;
    get xy(): [number, number];
    set x(value: number);
    set y(value: number);
    set z(value: number);
    set w(value: number);
    count(): number;
    luma(): number;
    scale(s: number): Vector;
    add(b: Vector): Vector;
    sub(b: Vector): Vector;
    mul(b: Vector): Vector;
    run(f: (v: number) => number): Vector;
    static fromHex(hex: string): Vector;
    toRGB(precision?: number): string;
    lerp(b: Vector, scale: number): Vector;
    distance(b: Vector): number;
    dot(b: Vector): number;
    clone(): Vector;
    unit(): Vector;
    mag(): number;
    str(): string;
    toString(): string;
}
export declare const VEC4: (x: number, y: number, z: number, w: number) => Vector;
export declare const VEC3: (x: number, y: number, z: number) => Vector;
export declare const VEC2: (x: number, y: number) => Vector;
