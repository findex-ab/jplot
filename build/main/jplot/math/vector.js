"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VEC2 = exports.VEC3 = exports.VEC4 = exports.Vector = void 0;
const lerp_1 = require("./lerp");
const array_1 = require("../utils/array");
const hash_1 = require("../utils/hash");
class Vector {
    constructor(x = 0, y = 0, z, w) {
        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._w = 0;
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
    }
    get x() {
        return this._x || 0;
    }
    get y() {
        return this._y || 0;
    }
    get z() {
        return this._z || 0;
    }
    get w() {
        return this._w || 0;
    }
    get xy() {
        return [this.x, this.y];
    }
    set x(value) {
        this._x = value;
    }
    set y(value) {
        this._y = value;
    }
    set z(value) {
        this._z = value;
    }
    set w(value) {
        this._w = value;
    }
    count() {
        if (typeof this._w === 'number')
            return 4;
        if (typeof this._z === 'number')
            return 3;
        return 2;
    }
    luma() {
        return this.dot((0, exports.VEC3)(0.299, 0.587, 0.114));
    }
    scale(s) {
        const count = this.count();
        switch (count) {
            case 2: return (0, exports.VEC2)(this.x * s, this.y * s);
            case 3: return (0, exports.VEC3)(this.x * s, this.y * s, this.z * s);
            case 4: return (0, exports.VEC4)(this.x * s, this.y * s, this.z * s, this.w * s);
            default: throw new Error(`Vector has ${count} components`);
        }
    }
    add(b) {
        const count = this.count();
        switch (count) {
            case 2: return (0, exports.VEC2)(this.x + b.x, this.y + b.y);
            case 3: return (0, exports.VEC3)(this.x + b.x, this.y + b.y, this.z + b.z);
            case 4: return (0, exports.VEC4)(this.x + b.x, this.y + b.y, this.z + b.z, this.w + b.w);
            default: throw new Error(`Vector has ${count} components`);
        }
    }
    sub(b) {
        const count = this.count();
        switch (count) {
            case 2: return (0, exports.VEC2)(this.x - b.x, this.y - b.y);
            case 3: return (0, exports.VEC3)(this.x - b.x, this.y - b.y, this.z - b.z);
            case 4: return (0, exports.VEC4)(this.x - b.x, this.y - b.y, this.z - b.z, this.w - b.w);
            default: throw new Error(`Vector has ${count} components`);
        }
    }
    mul(b) {
        const count = this.count();
        switch (count) {
            case 2: return (0, exports.VEC2)(this.x * b.x, this.y * b.y);
            case 3: return (0, exports.VEC3)(this.x * b.x, this.y * b.y, this.z * b.z);
            case 4: return (0, exports.VEC4)(this.x * b.x, this.y * b.y, this.z * b.z, this.w * b.w);
            default: throw new Error(`Vector has ${count} components`);
        }
    }
    run(f) {
        const count = this.count();
        switch (count) {
            case 2: return (0, exports.VEC2)(f(this.x), f(this.y));
            case 3: return (0, exports.VEC3)(f(this.x), f(this.y), f(this.z));
            case 4: return (0, exports.VEC4)(f(this.x), f(this.y), f(this.z), f(this.w));
            default: throw new Error(`Vector has ${count} components`);
        }
    }
    static fromHex(hex) {
        const val = (0, hash_1.hexToUint32)(hex);
        const numbers = (0, array_1.range)(4).map(n => (0, hash_1.nthByte)(val, n)).reverse();
        return new Vector(...numbers);
    }
    toRGB(precision = 3) {
        if (this.count() >= 4)
            return `rgba(${this.x.toFixed(precision)}, ${this.y.toFixed(precision)}, ${this.z.toFixed(precision)}, ${this.w.toFixed(precision)})`;
        return `rgb(${this.x.toFixed(precision)}, ${this.y.toFixed(precision)}, ${this.z.toFixed(precision)})`;
    }
    lerp(b, scale) {
        const count = this.count();
        switch (count) {
            case 2: return (0, exports.VEC2)((0, lerp_1.lerp)(this.x, b.x, scale), (0, lerp_1.lerp)(this.y, b.y, scale));
            case 3: return (0, exports.VEC3)((0, lerp_1.lerp)(this.x, b.x, scale), (0, lerp_1.lerp)(this.y, b.y, scale), (0, lerp_1.lerp)(this.z || 0, b.z || 0, scale));
            case 4: return (0, exports.VEC4)((0, lerp_1.lerp)(this.x, b.x, scale), (0, lerp_1.lerp)(this.y, b.y, scale), (0, lerp_1.lerp)(this.z || 0, b.z || 0, scale), (0, lerp_1.lerp)(this.w || 0, b.w || 0, scale));
            default: throw new Error(`Vector has ${count} components`);
        }
    }
    distance(b) {
        return Math.sqrt(Math.pow(this.x - b.x, 2.0) + Math.pow(this.y - b.y, 2.0) + Math.pow(this.z - b.z, 2.0));
    }
    dot(b) {
        const dx = this.x * b.x;
        const dy = this.y * b.y;
        const dz = this.z * b.z;
        const dw = this.w * b.w;
        return dx + dy + dz + dw;
    }
    clone() {
        const count = this.count();
        switch (count) {
            case 2: return (0, exports.VEC2)(this.x, this.y);
            case 3: return (0, exports.VEC3)(this.x, this.y, this.z);
            case 4: return (0, exports.VEC4)(this.x, this.y, this.z, this.w);
            default: throw new Error(`Vector has ${count} components`);
        }
    }
    unit() {
        const mag = this.mag();
        if (mag <= 0.000000001)
            return this.clone().scale(0);
        const invMag = 1.0 / mag;
        return this.scale(invMag);
    }
    mag() {
        return Math.sqrt(Math.pow(this.x || 0, 2.0) + Math.pow(this.y || 0, 2.0) + Math.pow(this.z || 0, 2.0) + Math.pow(this.w || 0, 2));
    }
    str() {
        const count = this.count();
        switch (count) {
            case 2: return `${this.x} ${this.y}`;
            case 3: return `${this.x} ${this.y} ${this.z}`;
            case 4: return `${this.x} ${this.y} ${this.z} ${this.w}`;
            default:
                {
                    throw new Error(`Vector has ${count} components.`);
                }
                ;
                break;
        }
    }
    toString() {
        return this.str();
    }
}
exports.Vector = Vector;
const VEC4 = (x, y, z, w) => new Vector(x, y, z, w);
exports.VEC4 = VEC4;
const VEC3 = (x, y, z) => new Vector(x, y, z);
exports.VEC3 = VEC3;
const VEC2 = (x, y) => new Vector(x, y);
exports.VEC2 = VEC2;
