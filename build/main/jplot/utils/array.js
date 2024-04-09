"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unique = exports.uniqueBy = exports.remapToIndex = exports.range = void 0;
const clamp_1 = require("../math/clamp");
const range = (n) => Array.from(Array(n).keys());
exports.range = range;
const remapToIndex = (n, nMin, nMax, arrLength, rounding = Math.round) => {
    return (0, clamp_1.clamp)(rounding((n / nMax) * (arrLength - 1)), 0, arrLength - 1);
};
exports.remapToIndex = remapToIndex;
const uniqueBy = (arr, key) => {
    const nextArr = [];
    try {
        const getId = (item, k) => {
            return typeof k === 'string' ? item[k] : k(item);
        };
        for (const item of arr) {
            const id = getId(item, key);
            const count = nextArr.filter((it) => getId(it, key) === id).length;
            if (count > 0)
                continue;
            nextArr.push(item);
        }
    }
    catch (e) {
        console.error('uniqueBy() failed.');
        console.error(e);
    }
    return nextArr;
};
exports.uniqueBy = uniqueBy;
const unique = (arr) => [...Array.from(new Set(arr))];
exports.unique = unique;
