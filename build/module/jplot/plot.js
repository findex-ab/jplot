import { VEC2 } from './math/vector';
import { isNumber } from './utils/is';
import { Tooltip } from './components/tooltip';
import { X } from 'xel';
import { useState } from './utils/reactivity/useState';
import { clamp } from './math/clamp';
import { aabbVSPoint } from './utils/geometry/aabb';
const LOADING_TIME = 1;
export const plot = (config) => {
    const canvas = document.createElement('canvas');
    const tooltip = Tooltip({
        position: VEC2(0, 0),
    });
    const root = X('div', {
        style: {
            width: '100%',
            height: '100%'
        },
        children: [canvas, tooltip],
    });
    const [state, setState] = useState({
        root: root,
        canvas: canvas,
        disabled: false,
        mouse: {
            position: VEC2(0, 0),
            localPosition: VEC2(0, 0),
            intersects: false
        },
        time: {
            now: 0,
            delta: 0,
            lastFrame: 0,
            started: 0,
        },
        dimensions: {
            ratio: VEC2(1, 1),
            ratioInverse: VEC2(1, 1),
        },
        tooltip: {
            xel: undefined,
            position: VEC2(0, 0),
            rect: { width: 0, height: 0 },
            visible: false
        },
        animationId: null,
        loading: true
    });
    const app = {
        state,
        setState,
    };
    const getPlotArgs = () => {
        const args = {
            state: state,
            config: config,
            canvas: state.canvas,
            hooks: config.hooks,
            app: app
        };
        return args;
    };
    const reloadCurrent = () => {
        const current = state.current;
        if (current && current.reload) {
            const args = getPlotArgs();
            current.reload(args);
        }
    };
    const getTimeElapsed = () => {
        const now = performance.now();
        return (now - state.time.started) / 1000;
    };
    // -------- Listeners
    const setTooltipVisible = (visible) => {
        state.tooltip.visible = visible;
        tooltip.state.opacity = visible ? 1 : 0;
    };
    const onMouseMove = (event) => {
        const elapsed = getTimeElapsed();
        const rect = state.canvas.getBoundingClientRect();
        state.mouse.position.x = event.x;
        state.mouse.position.y = event.y;
        state.mouse.localPosition = state.mouse.position
            .mul(state.dimensions.ratio)
            .sub(VEC2(rect.x, rect.y).mul(state.dimensions.ratio));
        const bounds = {
            min: VEC2(rect.x, rect.y),
            max: VEC2(rect.x + rect.width, rect.y + rect.height)
        };
        state.mouse.intersects = aabbVSPoint(bounds, state.mouse.position);
        if (config.disableWhenMouseOutside && !state.loading && elapsed > LOADING_TIME) {
            if (state.mouse.intersects) {
                state.disabled = false;
            }
            else {
                state.disabled = true;
            }
        }
    };
    // -------- Other
    const updateDimensions = () => {
        const parent = canvas.parentElement;
        if (!parent)
            return;
        if (config.canvasSize) {
            if (isNumber(config.canvasSize.x))
                state.canvas.style.width = `${config.canvasSize.x}px`;
            else
                state.canvas.style.width = config.canvasSize.x;
            if (isNumber(config.canvasSize.y))
                state.canvas.style.height = `${config.canvasSize.y}px`;
            else
                state.canvas.style.height = config.canvasSize.y;
        }
        const rect = config.fitParent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
        state.canvas.width = clamp(rect.width, 1, window.innerWidth);
        state.canvas.height = clamp(rect.height, 1, window.innerHeight);
        if (config.canvasResolution && !config.fitParent) {
            state.canvas.width = config.canvasResolution.x;
            state.canvas.height = config.canvasResolution.y;
        }
        const rx = state.canvas.width / Math.max(1, rect.width);
        const ry = state.canvas.height / Math.max(1, rect.height);
        state.dimensions.ratio = VEC2(rx, ry);
        state.dimensions.ratioInverse = VEC2(1.0 / rx, 1.0 / ry);
    };
    const updateTooltip = () => {
        setTooltipVisible(state.mouse.intersects);
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
        if ((time - lastCheck >= 1.0) || lastCheck <= 0) {
            everySecond();
            lastCheck = time;
        }
        const elapsed = getTimeElapsed();
        if (elapsed < LOADING_TIME) {
            if (!state.loading) {
                state.loading = true;
            }
        }
        else {
            if (state.loading) {
                state.loading = false;
                reloadCurrent();
            }
        }
        const args = getPlotArgs();
        const current = state.current = (state.current || config.plot(args));
        current.update(args);
    };
    const loop = (time) => {
        time /= 1000.0;
        state.time.now = time;
        state.time.delta = state.time.now - state.time.lastFrame;
        state.time.lastFrame = state.time.now;
        if (!state.disabled) {
            update(time);
        }
        updateTooltip();
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
        setTooltipVisible(false);
        document.addEventListener('mousemove', onMouseMove);
        start();
        queueMicrotask(() => {
            reloadCurrent();
        });
    };
    const destroy = () => {
        document.removeEventListener('mousemove', onMouseMove);
    };
    init();
    return { destroy, state, root, reload: reloadCurrent };
};
