"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linePlot = void 0;
const array_1 = require("../../utils/array");
const clamp_1 = require("../../math/clamp");
const vector_1 = require("../../math/vector");
const curve_1 = require("../../utils/drawing/curve");
const defaultFormat = (n) => typeof n === 'number' ? n.toFixed(3) : n + '';
const combine = (keys, values, fmt) => {
    if (keys.length !== values.length)
        return [keys, values];
    const dict = (0, array_1.unique)(keys).reduce((prev, cur) => {
        return Object.assign(Object.assign({}, prev), { [fmt(cur)]: 0 });
    }, {});
    for (let i = 0; i < keys.length; i++) {
        const key = fmt(keys[i]);
        const value = values[(0, clamp_1.clamp)(i, 0, values.length - 1)];
        dict[key] += value;
    }
    return [Object.keys(dict), Object.values(dict)];
};
const linePlot = (lineConfig) => (args) => {
    let prevTooltipPos = args.state.tooltip.position;
    return (args) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const { canvas, config } = args;
        if (config.datasets.length <= 0)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = ((_a = config.styling) === null || _a === void 0 ? void 0 : _a.font) || '1rem Sans-Serif';
        const formatX = ((_b = lineConfig.xAxis) === null || _b === void 0 ? void 0 : _b.format) || defaultFormat;
        const formatY = ((_c = lineConfig.yAxis) === null || _c === void 0 ? void 0 : _c.format) || defaultFormat;
        const verticalPadding = 48;
        const paddingLeft = 64;
        const plotHeight = canvas.height - verticalPadding * 2;
        const plotWidth = canvas.width - paddingLeft;
        const rect = canvas.getBoundingClientRect();
        const rx = canvas.width / rect.width;
        const ry = canvas.height / rect.height;
        const mouseLocal = args.state.mouse.localPosition;
        const rds = Math.min(canvas.height, canvas.width) /
            Math.max(canvas.height, canvas.width);
        const cursorRadius = 8 * rds * (((_d = lineConfig.cursor) === null || _d === void 0 ? void 0 : _d.scale) || 1);
        const dataset = config.datasets[0];
        const keys = ((_e = lineConfig.xAxis) === null || _e === void 0 ? void 0 : _e.unique) ? (0, array_1.unique)(dataset.keys) : dataset.keys;
        let [xValues, yValues] = lineConfig.mergeDuplicates ? combine(keys, dataset.values, formatX) : [keys.map(formatX), dataset.values];
        if ((_f = lineConfig.xAxis) === null || _f === void 0 ? void 0 : _f.unique)
            xValues = (0, array_1.unique)(xValues);
        //const xValues = dataset.keys;
        //const yValues = dataset.values;
        const xTickCount = Math.min(((_g = lineConfig.xAxis) === null || _g === void 0 ? void 0 : _g.tickCount) || 6, xValues.length);
        const yTickCount = Math.min(((_h = lineConfig.yAxis) === null || _h === void 0 ? void 0 : _h.tickCount) || 6, yValues.length);
        const minValue = Math.min(...yValues);
        const maxValue = Math.max(...yValues);
        const valueRange = maxValue - minValue;
        const yAxisInterval = valueRange / (yTickCount - 1);
        const yTickValues = (0, array_1.range)(yTickCount).map((i) => minValue + yAxisInterval * i);
        const xTickValues = (0, array_1.range)(xTickCount).map((i) => xValues[(0, array_1.remapToIndex)(i, 0, xTickCount, xValues.length)]);
        const yTickLabels = yTickValues.map(formatY);
        let xTickLabels = xTickValues; //.map(formatX);
        //let lastPointFix: boolean = false;
        //if (xValues.length >= 3) {
        //  const lastLabel = xValues[xValues.length-1];
        //  if (!xTickLabels.includes(lastLabel)) {
        //    xTickLabels.push(lastLabel);
        //    lastPointFix = true;
        //  }
        //}
        const points = [
            (0, vector_1.VEC2)(paddingLeft, plotHeight + verticalPadding),
            ...yValues.map((value, i) => {
                const y = verticalPadding +
                    (plotHeight - ((value - minValue) / valueRange) * plotHeight);
                const x = paddingLeft + i * (plotWidth / (yValues.length - 1));
                return (0, vector_1.VEC2)(x, y);
            }),
            (0, vector_1.VEC2)(plotWidth + paddingLeft, plotHeight + verticalPadding),
        ];
        const xAxisPoints = xTickLabels.map((_, i) => {
            let x = points[(0, array_1.remapToIndex)(i, 0, xTickLabels.length, points.length)].x; //paddingLeft + plotWidth * (i / xTickLabels.length);
            const y = canvas.height - verticalPadding / 2;
            //if (lastPointFix && i >= xTickLabels.length-1) {
            //  x = plotWidth + paddingLeft;
            //}
            return (0, vector_1.VEC2)(x, y);
        });
        const yAxisPoints = yTickLabels.map((_, i) => {
            const y = verticalPadding +
                (plotHeight / (yTickLabels.length - 1)) * (yTickLabels.length - i - 1);
            const x = 0;
            return (0, vector_1.VEC2)(x, y);
        });
        // draw y-axis lines
        yAxisPoints.forEach((p, i) => {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(plotWidth + paddingLeft, p.y);
            ctx.closePath();
            ctx.stroke();
        });
        // draw x-axis lines
        xAxisPoints.forEach((p, i) => {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, plotHeight - p.y);
            ctx.closePath();
            ctx.stroke();
        });
        switch (true) {
            case !!lineConfig.fill:
                {
                    ctx.fillStyle = ((_j = lineConfig.fill) === null || _j === void 0 ? void 0 : _j.color) || 'black';
                    ctx.strokeStyle = '';
                    if (((_k = lineConfig.fill) === null || _k === void 0 ? void 0 : _k.colorStops) &&
                        lineConfig.fill.colorStops.length > 0) {
                        const gradient = ctx.createLinearGradient(0, 0, 0, plotHeight * 2);
                        lineConfig.fill.colorStops.forEach((stop) => gradient.addColorStop(stop.stop, stop.color));
                        ctx.fillStyle = gradient;
                    }
                    lineConfig.curve
                        ? (0, curve_1.bzCurve)(ctx, points, lineConfig.curve.f, lineConfig.curve.t)
                        : (0, curve_1.lineSegment)(ctx, points);
                    //bzCurve(ctx, points);
                    ctx.fill();
                }
                break;
            default:
            case !!lineConfig.stroke:
                {
                    ctx.strokeStyle = ((_l = lineConfig.stroke) === null || _l === void 0 ? void 0 : _l.color) || 'black';
                    lineConfig.curve
                        ? (0, curve_1.bzCurve)(ctx, points, lineConfig.curve.f, lineConfig.curve.t)
                        : (0, curve_1.lineSegments)(ctx, points);
                    ctx.stroke();
                }
                break;
        }
        // draw y-axis labels
        yAxisPoints.forEach((p, i) => {
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.fillText(yTickLabels[i], p.x, p.y);
            ctx.closePath();
        });
        // draw x-axis labels
        xAxisPoints.forEach((p, i) => {
            var _a;
            let x = p.x;
            const m = ctx.measureText(xTickLabels[i]);
            if ((_a = lineConfig.xAxis) === null || _a === void 0 ? void 0 : _a.centerLabels) {
                x -= m.width * 0.5;
            }
            x = (0, clamp_1.clamp)(x, 0, canvas.width - m.width);
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.fillText(xTickLabels[i], x, p.y);
            ctx.closePath();
        });
        // mouse
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.arc(mouseLocal.x, mouseLocal.y, cursorRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        const getValueIndexAtX = (x, xMin) => {
            const remapped = x - xMin - (0 + paddingLeft); // Adjust for padding
            const index = Math.round((remapped / plotWidth) * (yValues.length - 1));
            return (0, clamp_1.clamp)(index, 0, yValues.length - 1);
        };
        const getKeyIndexAtX = (x, xMin) => {
            const remapped = x - xMin - (0 + paddingLeft); // Adjust for padding
            const index = Math.round((remapped / plotWidth) * (xValues.length - 1));
            return (0, clamp_1.clamp)(index, 0, xValues.length - 1);
        };
        const getPointIndexAtX = (x, xMin) => {
            const remapped = x - xMin - (0 + paddingLeft); // Adjust for padding
            const index = Math.round((remapped / plotWidth) * (points.length - 1));
            return (0, clamp_1.clamp)(index, 1, Math.max(points.length - 2, 1));
        };
        const mx = (args.state.mouse.position.x - rect.x) / rect.width;
        const keyIndex = getKeyIndexAtX(mouseLocal.x, 0); //clamp(Math.floor(mx * xValues.length), 0, xValues.length-1);
        const valueIndex = getValueIndexAtX(mouseLocal.x, 0);
        const pointIndex = getPointIndexAtX(mouseLocal.x, 0);
        const point = points[pointIndex];
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(point.x, plotHeight + verticalPadding);
        ctx.lineTo(point.x, 0);
        ctx.closePath();
        ctx.stroke();
        args.state.tooltip.text = `${yValues[valueIndex]}`;
        const nextTooltipPos = prevTooltipPos.lerp(point
            .mul(args.state.dimensions.ratioInverse)
            .add((0, vector_1.VEC2)(rect.x, rect.y - 16)), (0, clamp_1.clamp)(args.app.state.time.delta * 8, 0, 1));
        prevTooltipPos = nextTooltipPos;
        args.state.tooltip.position = nextTooltipPos;
        ctx.fillStyle = ((_m = lineConfig.cursor) === null || _m === void 0 ? void 0 : _m.color) || 'black';
        ctx.beginPath();
        ctx.arc(point.x, point.y, cursorRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        if (args.hooks) {
            const { onDataHover } = args.hooks;
            if (onDataHover) {
                onDataHover(args.app, xValues[keyIndex], yValues[valueIndex]);
            }
        }
    };
};
exports.linePlot = linePlot;
