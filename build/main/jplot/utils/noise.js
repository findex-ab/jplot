"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.octNoise = exports.noise = void 0;
const fract_1 = require("../math/fract");
const hash_1 = require("../utils/hash");
const lerp_1 = require("../math/lerp");
const SEED = 887173;
const noise = (x, seed = SEED) => {
    let lv = (0, fract_1.fract)(x);
    lv = lv * lv * (3.0 - 2.0 * lv);
    const id = Math.floor(x);
    return (0, lerp_1.lerp)((0, hash_1.hashf)(id, seed), (0, hash_1.hashf)(id + 1.0, seed), lv);
};
exports.noise = noise;
const octNoise = (x, f, oct = 5, seed = SEED) => {
    let n = 0.0;
    let div = 0.0;
    let amp = 1.0;
    for (let i = 0; i < oct; i++) {
        n += amp * (0, exports.noise)(x * f, seed);
        div += amp;
        amp *= 0.5;
        f *= 2.0;
    }
    return n / div;
};
exports.octNoise = octNoise;
