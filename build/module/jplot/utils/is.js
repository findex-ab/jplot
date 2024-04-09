export const isNumber = (x) => typeof x === 'number';
export const isFloat = (x) => isNumber(x) && x.toString().includes('.');
export const isString = (x) => typeof x === 'string';
export const isBoolean = (x) => typeof x === 'boolean';
export const isFactor = (x) => isNumber(x) || isString(x) || isBoolean(x);
export const isUndefined = (x) => (typeof x === 'undefined');
export const isDigit = (c) => {
    if (isUndefined(c) || c === null)
        return false;
    const n = c.codePointAt(0) || 0;
    return n >= 48 && n <= 57;
};
export const isNumerical = (c) => {
    const digits = Array.from(c).filter(isDigit);
    return digits.length >= c.length;
};
