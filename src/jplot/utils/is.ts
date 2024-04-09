export const isNumber = (x: any): x is number => typeof x === 'number';
export const isFloat = (x: any): x is number => isNumber(x) && x.toString().includes('.');
export const isString = (x: any): x is string => typeof x === 'string';
export const isBoolean = (x: any): x is boolean => typeof x === 'boolean';
export const isFactor = (x: any): x is number | string | boolean | Date => isNumber(x) || isString(x) || isBoolean(x);
export const isUndefined = (x?: any): x is undefined => (typeof x === 'undefined');
export const isDigit = (c: string): boolean => {
  if (isUndefined(c) || c === null) return false;
  const n = c.codePointAt(0) || 0;
  return n >= 48 && n <= 57;
}

export const isNumerical = (c: string): boolean => {
  const digits = Array.from(c).filter(isDigit);
  return digits.length >= c.length;
}
