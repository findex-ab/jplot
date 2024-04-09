"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const line_1 = require("../jplot/plots/line");
const plot_1 = require("../jplot/plot");
const array_1 = require("../jplot/utils/array");
const noise_1 = require("../jplot/utils/noise");
const xel_1 = require("xel");
const canvas = document.getElementById('canvas');
const CHARS = Array.from('abcdefghijklmnopqrstuvwxyz');
const SEED = performance.now() + Math.random();
const N = 160;
const F = 2.3123;
const main = () => {
    //canvas.style.width = "100%";
    //canvas.style.height = "100%";
    //const rect = canvas.getBoundingClientRect();
    //canvas.width = rect.width;
    //canvas.height = rect.height;
    const dataItems = (0, array_1.range)(N).map((i) => ({
        key: CHARS[i % CHARS.length],
        value: (0, noise_1.octNoise)(0.03818718 + F * (i / N), F, 4, SEED),
    }));
    const TICK_COUNT = 9; //Math.round(lerp(16, 32, 0.5+0.5*Math.sin(time/500.0)));
    const width = 512 * 2;
    const height = (width / 16) * 10; // / 16 * 9;// / 16 * 9;
    const { root } = (0, plot_1.plot)({
        hooks: {
            onDataHover: (app, key, value) => {
                app.setState((s) => {
                    s.tooltip.body = (0, xel_1.X)('div', {
                        children: [
                            (0, xel_1.X)('div', {
                                style: { fontWeight: 'bold', fontFamily: 'sans-serif' },
                                innerText: key,
                            }),
                            (0, xel_1.X)('div', {
                                style: {
                                    fontFamily: 'sans-serif',
                                    marginTop: '0.5rem',
                                    width: '100%',
                                },
                                innerText: value,
                            }),
                        ],
                    });
                    return s;
                });
            },
        },
        canvasSize: { x: width, y: height },
        canvasResolution: { x: width, y: height },
        plot: (0, line_1.linePlot)({
            fill: {
                colorStops: [
                    { stop: 0.0, color: 'red' },
                    { stop: 1.0, color: 'white' },
                ],
            },
            xAxis: {
                tickCount: TICK_COUNT,
            },
            yAxis: {
                tickCount: TICK_COUNT,
            },
        }),
        datasets: [
            {
                keys: dataItems.map((it) => it.key),
                values: dataItems.map((it) => it.value),
            },
        ],
    });
    (0, xel_1.mount)(root, { target: document.getElementById('app') });
};
main();
