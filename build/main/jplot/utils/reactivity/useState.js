"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useState = void 0;
const proxy_1 = require("./proxy");
const useState = (initial) => {
    const p = (0, proxy_1.proxy)(initial);
    const setState = (fun) => {
        const next = fun(p);
        for (const [key, value] of Object.entries(next)) {
            p[key] = value;
        }
    };
    return [p, setState];
};
exports.useState = useState;
