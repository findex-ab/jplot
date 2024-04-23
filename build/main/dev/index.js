"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const line_1 = require("../jplot/plots/line");
const plot_1 = require("../jplot/plot");
const array_1 = require("../jplot/utils/array");
const noise_1 = require("../jplot/utils/noise");
const xel_1 = require("xel");
const canvas = document.getElementById('canvas');
const CHARS = Array.from('abcdefghijklmnopqrstuvwxyz');
const SEED = 2011095; //performance.now() + Math.random();
const N = 160;
const F = 2.3123;
const main = () => {
    //canvas.style.width = "100%";
    //canvas.style.height = "100%";
    //const rect = canvas.getBoundingClientRect();
    //canvas.width = rect.width;
    //canvas.height = rect.height;
    const dataItems = (0, array_1.range)(N).map((i) => ({
        key: CHARS[0],
        value: (0, noise_1.octNoise)(0.03818718 + F * (i / N), F, 4, SEED),
    }));
    const TICK_COUNT = 9; //Math.round(lerp(16, 32, 0.5+0.5*Math.sin(time/500.0)));
    const width = 640;
    const height = width / 16 * 9;
    const { root } = (0, plot_1.plot)({
        hooks: {
            onDataHover: (app, key, value) => {
                app.setState((s) => {
                    s.tooltip.body = (0, xel_1.X)('div', {
                        render() {
                            return (0, xel_1.X)('div', {
                                children: [
                                    (0, xel_1.X)('div', { style: { fontWeight: 'bold', fontFamily: 'sans-serif' }, innerText: key }),
                                    (0, xel_1.X)('div', { style: { fontFamily: 'sans-serif' }, innerText: value })
                                ]
                            });
                        }
                    });
                    return s;
                });
            },
        },
        canvasSize: { x: width, y: height },
        canvasResolution: { x: width * 2, y: height * 2 },
        plot: (0, line_1.linePlot)({
            mergeDuplicates: true,
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
                startAtZero: true
            },
        }),
        datasets: [
            {
                keys: dataItems.map((it) => it.key),
                values: dataItems.map((it) => it.value),
            },
        ],
    });
    const App = (0, xel_1.X)('div', {
        style: {
            width: `fit-content`,
            height: `fit-content`
        },
        render() {
            return root;
        }
    });
    (0, xel_1.mount)(App, { target: document.getElementById('app') });
};
main();
