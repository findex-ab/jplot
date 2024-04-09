import { clamp } from '../math/clamp';
export const range = (n) => Array.from(Array(n).keys());
export const remapToIndex = (n, nMin, nMax, arrLength, rounding = Math.round) => {
    return clamp(rounding((n / nMax) * (arrLength - 1)), 0, arrLength - 1);
};
export const uniqueBy = (arr, key) => {
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
export const unique = (arr) => [...Array.from(new Set(arr))];
