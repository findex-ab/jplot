"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxy = void 0;
const proxy = (initial) => {
    return new Proxy(initial, {
        set(target, p, newValue, receiver) {
            const key = p;
            if (target[key] === newValue)
                return true;
            target[key] = newValue;
            return true;
        },
        get(target, p, receiver) {
            const key = p;
            return target[key];
        }
    });
};
exports.proxy = proxy;
