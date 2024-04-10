"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plot = void 0;
const vector_1 = require("./math/vector");
const tooltip_1 = require("./components/tooltip");
const xel_1 = require("xel");
const useState_1 = require("./utils/reactivity/useState");
const clamp_1 = require("./math/clamp");
const aabb_1 = require("./utils/geometry/aabb");
const LOADING_TIME = 1;
const plot = (config) => {
    const canvas = document.createElement('canvas');
    const tooltip = (0, tooltip_1.Tooltip)({
        position: (0, vector_1.VEC2)(0, 0),
    });
    const root = (0, xel_1.X)('div', {
        style: {
            width: '100%',
            height: '100%'
        },
        children: [canvas, tooltip],
    });
    const [state, setState] = (0, useState_1.useState)({
        root: root,
        canvas: canvas,
        disabled: false,
        mouse: {
            position: (0, vector_1.VEC2)(0, 0),
            localPosition: (0, vector_1.VEC2)(0, 0),
        },
        time: {
            now: 0,
            delta: 0,
            lastFrame: 0,
            started: 0,
        },
        dimensions: {
            ratio: (0, vector_1.VEC2)(1, 1),
            ratioInverse: (0, vector_1.VEC2)(1, 1),
        },
        tooltip: {
            xel: undefined,
            position: (0, vector_1.VEC2)(0, 0),
            rect: { width: 0, height: 0 }
        },
        animationId: null,
        loading: true
    });
    const app = {
        state,
        setState,
    };
    const getTimeElapsed = () => {
        const now = performance.now();
        return (now - state.time.started) / 1000;
    };
    // -------- Listeners
    const onLoadingToggle = (loading) => {
        tooltip.state.opacity = loading ? 0 : 1;
    };
    const onDisableToggle = (disabled) => {
        tooltip.state.opacity = disabled ? 0 : 1;
    };
    const onMouseMove = (event) => {
        const elapsed = getTimeElapsed();
        const rect = state.canvas.getBoundingClientRect();
        state.mouse.position.x = event.x;
        state.mouse.position.y = event.y;
        state.mouse.localPosition = state.mouse.position
            .mul(state.dimensions.ratio)
            .sub((0, vector_1.VEC2)(rect.x, rect.y).mul(state.dimensions.ratio));
        if (config.disableWhenMouseOutside && !state.loading && elapsed > LOADING_TIME) {
            const bounds = {
                min: (0, vector_1.VEC2)(rect.x, rect.y),
                max: (0, vector_1.VEC2)(rect.x + rect.width, rect.y + rect.height)
            };
            if ((0, aabb_1.aabbVSPoint)(bounds, state.mouse.position)) {
                state.disabled = false;
                onDisableToggle(state.disabled);
            }
            else {
                state.disabled = true;
                onDisableToggle(state.disabled);
            }
        }
    };
    // -------- Other
    const updateDimensions = () => {
        const parent = canvas.parentElement;
        if (!parent)
            return;
        //if (config.canvasResolution) {
        //  state.canvas.width = config.canvasResolution.x;
        //  state.canvas.height = config.canvasResolution.y;
        //}
        //if (config.canvasSize) {
        //  if (isNumber(config.canvasSize.x))
        //    state.canvas.style.width = `${config.canvasSize.x}px`;
        //  else state.canvas.style.width = config.canvasSize.x;
        //  if (isNumber(config.canvasSize.y))
        //    state.canvas.style.height = `${config.canvasSize.y}px`;
        //  else state.canvas.style.height = config.canvasSize.y;
        //}
        const rect = parent.getBoundingClientRect();
        state.canvas.width = (0, clamp_1.clamp)(rect.width, 1, window.innerWidth);
        state.canvas.height = (0, clamp_1.clamp)(rect.height, 1, window.innerHeight);
        const rx = state.canvas.width / Math.max(1, rect.width);
        const ry = state.canvas.height / Math.max(1, rect.height);
        state.dimensions.ratio = (0, vector_1.VEC2)(rx, ry);
        state.dimensions.ratioInverse = (0, vector_1.VEC2)(1.0 / rx, 1.0 / ry);
    };
    const updateTooltip = () => {
        tooltip.state.position = state.tooltip.position;
        tooltip.state.body = state.tooltip.body;
        if (tooltip.el) {
            const el = tooltip.el;
            const tooltipRect = el.getBoundingClientRect();
            state.tooltip.rect = tooltipRect;
        }
    };
    let lastCheck = 0;
    const everySecond = () => {
        updateDimensions();
    };
    const update = (time) => {
        if (time - lastCheck >= 1.0) {
            everySecond();
            lastCheck = time;
        }
        const elapsed = getTimeElapsed();
        if (elapsed < LOADING_TIME) {
            if (!state.loading) {
                state.loading = true;
                onLoadingToggle(state.loading);
            }
        }
        else {
            if (state.loading) {
                state.loading = false;
                onLoadingToggle(state.loading);
            }
        }
        const args = {
            state: state,
            config: config,
            canvas: state.canvas,
            hooks: config.hooks,
            app: app
        };
        const fun = state.fun = (state.fun || config.plot(args));
        fun(args);
        updateTooltip();
    };
    const loop = (time) => {
        time /= 1000.0;
        state.time.now = time;
        state.time.delta = state.time.now - state.time.lastFrame;
        state.time.lastFrame = state.time.now;
        if (!state.disabled) {
            update(time);
        }
        return requestAnimationFrame(loop);
    };
    const start = () => {
        if (state.animationId !== null)
            return;
        state.time.started = performance.now();
        state.time.lastFrame = state.time.started;
        state.animationId = loop(0);
    };
    const init = () => {
        document.addEventListener('mousemove', onMouseMove);
        start();
    };
    const destroy = () => {
        document.removeEventListener('mousemove', onMouseMove);
    };
    init();
    return { destroy, state, root };
};
exports.plot = plot;
