import { fract } from '../math/fract';
import { hashf } from '../utils/hash';
import { lerp } from '../math/lerp';
const SEED = 887173;
export const noise = (x, seed = SEED) => {
    let lv = fract(x);
    lv = lv * lv * (3.0 - 2.0 * lv);
    const id = Math.floor(x);
    return lerp(hashf(id, seed), hashf(id + 1.0, seed), lv);
};
export const octNoise = (x, f, oct = 5, seed = SEED) => {
    let n = 0.0;
    let div = 0.0;
    let amp = 1.0;
    for (let i = 0; i < oct; i++) {
        n += amp * noise(x * f, seed);
        div += amp;
        amp *= 0.5;
        f *= 2.0;
    }
    return n / div;
};
