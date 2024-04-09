"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nthByte = exports.hexToUint32 = exports.toUint32 = exports.floatBitsToUint = exports.hash21f = exports.hashf = exports.hashu32 = void 0;
const is_1 = require("./is");
const SEED = 817283;
const hashu32 = (i, seed = SEED) => {
    i = (0, exports.toUint32)(i);
    const s = ((i >> 3) * 12);
    const s2 = (0, exports.toUint32)(seed);
    const k = (0, exports.toUint32)(~i + ~s + ~s2 + (((~s2) >> 3) ^ (s2 << 17)));
    i ^= i << 17;
    i ^= i >> 13;
    i ^= i << 5;
    i += (i ^ k) + i * k;
    i *= 1013;
    i ^= (i >> 4);
    return (0, exports.toUint32)(i * k + i + i * k + k);
};
exports.hashu32 = hashu32;
const hashf = (i, seed = SEED) => {
    return (0, exports.hashu32)(i, seed) / (0, exports.toUint32)(0xFFFFFFFF);
};
exports.hashf = hashf;
const hash21f = (ix, iy, is = 1.98472) => {
    let x = (0, exports.toUint32)(ix);
    let y = (0, exports.toUint32)(iy);
    const s = (0, exports.toUint32)(is);
    const kx = ~x;
    const ky = ~y;
    x = (0, exports.hashu32)(x + s * 13);
    y = (0, exports.hashu32)(y + s * 13);
    return (0, exports.toUint32)(x * 5013 + y * 1013 + (ky * 5013 + kx * 1013)) / 0xffffffff;
};
exports.hash21f = hash21f;
const floatBitsToUint = (f) => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, f);
    return view.getUint32(0);
};
exports.floatBitsToUint = floatBitsToUint;
const toUint32 = (f) => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, (0, is_1.isFloat)(f) ? (0, exports.floatBitsToUint)(f) : f);
    return view.getUint32(0);
};
exports.toUint32 = toUint32;
const hexToUint32 = (hex) => {
    let stringValue = hex.replace('#', '').replace('0x', '');
    stringValue = stringValue.length < 8 ? `${stringValue}FF` : stringValue;
    stringValue = `0x${stringValue}`;
    return (0, exports.toUint32)(parseInt(stringValue, 16));
};
exports.hexToUint32 = hexToUint32;
const nthByte = (val, n) => {
    return (val >> (n * 8)) & 0xFF;
};
exports.nthByte = nthByte;
