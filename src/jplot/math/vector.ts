import { lerp as mix } from './lerp';
import { range } from '../utils/array';
import { hexToUint32, nthByte } from '../utils/hash';

export interface IVector {
  x: number;
  y: number;
  z?: number;
  w?: number;
}

export class Vector implements IVector {
  _x: number = 0;
  _y: number = 0;
  _z?: number = 0;
  _w?: number = 0;

  constructor(
    x: number = 0,
    y: number = 0,
    z?: number,
    w?: number
  ) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }

  get x(): number {
    return this._x || 0;
  }

  get y(): number {
    return this._y || 0;
  }

  get z(): number {
    return this._z || 0;
  }

  get w(): number {
    return this._w || 0;
  }

  get xy(): [number, number] {
    return [this.x, this.y];
  }

  set x(value: number) {
    this._x = value;
  }

  set y(value: number) {
    this._y = value;
  }

  set z(value: number) {
    this._z = value;
  }

  set w(value: number) {
    this._w = value;
  }

  count(): number {
    if (typeof this._w === 'number') return 4;
    if (typeof this._z === 'number') return 3;
    return 2;
  }

  luma() {
    return this.dot(VEC3(0.299, 0.587, 0.114));
  }

  scale(s: number) {
    const count = this.count();

    switch (count) {
      case 2: return VEC2(this.x * s, this.y * s);
      case 3: return VEC3(this.x * s, this.y * s, this.z * s);
      case 4: return VEC4(this.x * s, this.y * s, this.z * s, this.w * s);
      default: throw new Error(`Vector has ${count} components`);
    }
  }

  add(b: Vector) {
    const count = this.count();

    switch (count) {
      case 2: return VEC2(this.x + b.x, this.y + b.y);
      case 3: return VEC3(this.x + b.x, this.y + b.y, this.z + b.z);
      case 4: return VEC4(this.x + b.x, this.y + b.y, this.z + b.z, this.w + b.w);
      default: throw new Error(`Vector has ${count} components`);
    }
  }

  sub(b: Vector) {
    const count = this.count();

    switch (count) {
      case 2: return VEC2(this.x - b.x, this.y - b.y);
      case 3: return VEC3(this.x - b.x, this.y - b.y, this.z - b.z);
      case 4: return VEC4(this.x - b.x, this.y - b.y, this.z - b.z, this.w - b.w);
      default: throw new Error(`Vector has ${count} components`);
    }
  }

  mul(b: Vector) {
    const count = this.count();

    switch (count) {
      case 2: return VEC2(this.x * b.x, this.y * b.y);
      case 3: return VEC3(this.x * b.x, this.y * b.y, this.z * b.z);
      case 4: return VEC4(this.x * b.x, this.y * b.y, this.z * b.z, this.w * b.w);
      default: throw new Error(`Vector has ${count} components`);
    }
  }

  run(f: (v: number) => number) {
    const count = this.count();
    switch (count) {
      case 2: return VEC2(f(this.x), f(this.y));
      case 3: return VEC3(f(this.x), f(this.y), f(this.z));
      case 4: return VEC4(f(this.x), f(this.y), f(this.z), f(this.w));
      default: throw new Error(`Vector has ${count} components`);
    }
  }

  static fromHex(hex: string) {
    const val = hexToUint32(hex);
    const numbers = range(4).map(n => nthByte(val, n)).reverse();
    return new Vector(...numbers);
  }

  toRGB(precision: number = 3) {
    if (this.count() >= 4) return `rgba(${this.x.toFixed(precision)}, ${this.y.toFixed(precision)}, ${this.z.toFixed(precision)}, ${this.w.toFixed(precision)})`;
    return `rgb(${this.x.toFixed(precision)}, ${this.y.toFixed(precision)}, ${this.z.toFixed(precision)})`
  }

  lerp(b: Vector, scale: number) {
    const count = this.count();

    switch (count) {
      case 2: return VEC2(
        mix(this.x, b.x, scale),
        mix(this.y, b.y, scale),
      );
      case 3: return VEC3(
        mix(this.x, b.x, scale),
        mix(this.y, b.y, scale),
        mix(this.z || 0, b.z || 0, scale)
      );
      case 4: return VEC4(
        mix(this.x, b.x, scale),
        mix(this.y, b.y, scale),
        mix(this.z || 0, b.z || 0, scale),
        mix(this.w || 0, b.w || 0, scale),
      );
      default: throw new Error(`Vector has ${count} components`);
    }
  }

  distance(b: Vector) {
    return Math.sqrt(Math.pow(this.x - b.x, 2.0) + Math.pow(this.y - b.y, 2.0) + Math.pow(this.z - b.z, 2.0));
  }

  dot(b: Vector) {
    const dx = this.x * b.x;
    const dy = this.y * b.y;
    const dz = this.z * b.z;
    const dw = this.w * b.w;
    return dx + dy + dz + dw;
  }

  clone() {
    const count = this.count();
    switch (count) {
      case 2: return VEC2(this.x, this.y);
      case 3: return VEC3(this.x, this.y, this.z);
      case 4: return VEC4(this.x, this.y, this.z, this.w);
      default: throw new Error(`Vector has ${count} components`);
    }
  }

  unit() {
    const mag = this.mag();
    if (mag <= 0.000000001) return this.clone().scale(0);
    const invMag = 1.0 / mag;
    return this.scale(invMag);
  }

  mag(): number {
   return Math.sqrt(Math.pow(this.x || 0, 2.0) + Math.pow(this.y || 0, 2.0) + Math.pow(this.z || 0, 2.0) + Math.pow(this.w || 0, 2));
  }

  str():string {
    const count = this.count();
    switch (count) {
      case 2: return `${this.x} ${this.y}`;
      case 3: return `${this.x} ${this.y} ${this.z}`;
      case 4: return `${this.x} ${this.y} ${this.z} ${this.w}`;
      default: {
        throw new Error(`Vector has ${count} components.`);
      }; break;
    }
  }

  toString(): string {
    return this.str();
  }
}

export const VEC4 = (x: number, y: number, z: number, w: number) => new Vector(x, y, z, w);
export const VEC3 = (x: number, y: number, z: number) => new Vector(x, y, z);
export const VEC2 = (x: number, y: number) => new Vector(x, y);
