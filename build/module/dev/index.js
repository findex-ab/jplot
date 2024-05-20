import { linePlot } from '../jplot/plots/line';
import { plot } from '../jplot/plot';
import { range } from '../jplot/utils/array';
import { octNoise } from '../jplot/utils/noise';
import { mount, X } from 'xel';
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
    const dataItems = range(N).map((i) => ({
        key: CHARS[0],
        value: octNoise(0.03818718 + F * (i / N), F, 4, SEED),
    }));
    const TICK_COUNT = 9; //Math.round(lerp(16, 32, 0.5+0.5*Math.sin(time/500.0)));
    const width = 640;
    const height = width / 16 * 9;
    const { root } = plot({
        hooks: {
            onDataHover: (app, key, value) => {
                app.setState((s) => {
                    s.tooltip.body = X('div', {
                        render() {
                            return X('div', {
                                children: [
                                    X('div', { style: { fontWeight: 'bold', fontFamily: 'sans-serif' }, innerText: key }),
                                    X('div', { style: { fontFamily: 'sans-serif' }, innerText: value })
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
        disableWhenMouseOutside: true,
        plot: linePlot({
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
    const App = X('div', {
        style: {
            width: `fit-content`,
            height: `fit-content`
        },
        render() {
            return root;
        }
    });
    mount(App, { target: document.getElementById('app') });
};
main();
