import { StringIndexable } from "../types";

export const proxy = <T extends StringIndexable>(initial: T) => {
  return new Proxy<T>(initial, {
    set(target: T, p: string | symbol, newValue: any, receiver: any) {
      const key = p as keyof T;
      if (target[key] === newValue) return true;
      target[key] = newValue;
      return true;
    },
    get(target: T, p: string | symbol, receiver: any) {
      const key = p as keyof T;
      return target[key];
    }
  })
}
