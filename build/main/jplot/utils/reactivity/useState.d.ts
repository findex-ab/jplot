import { StringIndexable } from "../types";
export type SetStateFunction<T extends StringIndexable = StringIndexable> = (fun: (state: T) => T) => void;
export declare const useState: <T extends StringIndexable = StringIndexable>(initial: T) => [T, SetStateFunction<T>];
