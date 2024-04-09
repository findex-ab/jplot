import { lerp } from '../jplot/math/lerp';
import { linePlot } from '../jplot/plots/line';
import { plot } from '../jplot/plot';
import { range } from '../jplot/utils/array';
import { hashf, hashu32 } from '../jplot/utils/hash';
import { noise, octNoise } from '../jplot/utils/noise';
import { mount, X } from 'xel';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

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

  const dataItems = range(N).map((i) => ({
    key: CHARS[i % CHARS.length],
    value: octNoise(0.03818718 + F * (i / N), F, 4, SEED),
  }));

  const TICK_COUNT = 9; //Math.round(lerp(16, 32, 0.5+0.5*Math.sin(time/500.0)));

  const width = 512 * 2;
  const height = (width / 16) * 10; // / 16 * 9;// / 16 * 9;

  const { root } = plot({
    hooks: {
      onDataHover: (app, key, value) => {
        app.setState((s) => {
          s.tooltip.body = X('div', {
            children: [
              X('div', {
                style: { fontWeight: 'bold', fontFamily: 'sans-serif' },
                innerText: key,
              }),
              X('div', {
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
    plot: linePlot({
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

  mount(root, { target: document.getElementById('app') });
};

main();
