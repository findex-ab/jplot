export declare const range: (n: number) => number[];
type RoundingFunction = (n: number) => number;
export declare const remapToIndex: (n: number, nMin: number, nMax: number, arrLength: number, rounding?: RoundingFunction) => number;
export declare const uniqueBy: <T, KV = string>(arr: T[], key: string | ((item: T) => KV)) => T[];
export declare const unique: <T>(arr: T[]) => T[];
export {};
