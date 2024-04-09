import { StringIndexable } from "../types";
import { proxy } from "./proxy";

export type SetStateFunction<T extends StringIndexable = StringIndexable> = (fun: (state: T) => T) => void;

export const useState = <T extends StringIndexable = StringIndexable>(initial: T): [T, SetStateFunction<T>] => {
  const p = proxy<T>(initial);

  const setState = (fun: (state: T) => T) => {
    const next = fun(p);
    for (const [key, value] of Object.entries(next)) {
      p[key as keyof typeof p] = value;
    }
  }

  return [p, setState];
}
