import { VEC2, Vector } from './math/vector';
import {
  PlotApp,
  PlotArguments,
  type PlotAppConfig,
  type PlotAppState,
  type PlotConfig,
  type PlotFunction,
} from './types';
import { isNumber } from './utils/is';
import { Tooltip } from './components/tooltip';
import { mount, X } from 'xel';
import { TooltipProps } from './components/tooltip/types';
import { useState } from './utils/reactivity/useState';
import { clamp } from './math/clamp';
import { AABB, aabbVSPoint } from './utils/geometry/aabb';

const LOADING_TIME = 1;

export const plot = (config: PlotAppConfig) => {
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

  const [state, setState] = useState<PlotAppState>({
    root: root,
    canvas: canvas,
    disabled: false,
    mouse: {
      position: VEC2(0, 0),
      localPosition: VEC2(0, 0),
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
      rect: { width: 0, height: 0 }
    },
    animationId: null,
    loading: true
  });

  const app: PlotApp = {
    state,
    setState,
  };

  const getTimeElapsed = () => {
    const now = performance.now();
    return (now - state.time.started) / 1000;
  }

  // -------- Listeners

  const onLoadingToggle = (loading: boolean) => {
    tooltip.state.opacity = loading ? 0 : 1;
  }

  const onDisableToggle = (disabled: boolean) => {
    tooltip.state.opacity = disabled ? 0 : 1;
  }

  const onMouseMove = (event: MouseEvent) => {
    const elapsed = getTimeElapsed();

    const rect = state.canvas.getBoundingClientRect();
    state.mouse.position.x = event.x;
    state.mouse.position.y = event.y;
    state.mouse.localPosition = state.mouse.position
      .mul(state.dimensions.ratio)
      .sub(VEC2(rect.x, rect.y).mul(state.dimensions.ratio));


    if (config.disableWhenMouseOutside && !state.loading && elapsed > LOADING_TIME) {
      const bounds: AABB = {
        min: VEC2(rect.x, rect.y),
        max: VEC2(rect.x + rect.width, rect.y + rect.height)
      };

      if (aabbVSPoint(bounds, state.mouse.position)) {
        state.disabled = false;
        onDisableToggle(state.disabled);
      } else {
        state.disabled = true;
        onDisableToggle(state.disabled);
      }
    }
  };

  // -------- Other

  const updateDimensions = () => {
    const parent = canvas.parentElement;
    if (!parent) return;

    if (config.canvasSize) {
      if (isNumber(config.canvasSize.x))
        state.canvas.style.width = `${config.canvasSize.x}px`;
      else state.canvas.style.width = config.canvasSize.x;
      if (isNumber(config.canvasSize.y))
        state.canvas.style.height = `${config.canvasSize.y}px`;
      else state.canvas.style.height = config.canvasSize.y;
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


    tooltip.state.position = state.tooltip.position;
    tooltip.state.body = state.tooltip.body;

    if (tooltip.el) {
      const el = tooltip.el as HTMLElement;
      const tooltipRect = el.getBoundingClientRect();
      state.tooltip.rect = tooltipRect;
    }
  };

  let lastCheck: number = 0;

  const everySecond = () => {
    updateDimensions();
  };

  const update = (time: number) => {
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
    } else {
      if (state.loading) {
        state.loading = false;
        onLoadingToggle(state.loading);
      }
    }

    const args: PlotArguments = {
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

  const loop = (time: number) => {
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
    if (state.animationId !== null) return;
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
