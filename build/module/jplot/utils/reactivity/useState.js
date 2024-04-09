import { proxy } from "./proxy";
export const useState = (initial) => {
    const p = proxy(initial);
    const setState = (fun) => {
        const next = fun(p);
        for (const [key, value] of Object.entries(next)) {
            p[key] = value;
        }
    };
    return [p, setState];
};
