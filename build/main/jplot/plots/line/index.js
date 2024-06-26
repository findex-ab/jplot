"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linePlot = void 0;
const array_1 = require("../../utils/array");
const clamp_1 = require("../../math/clamp");
const vector_1 = require("../../math/vector");
const curve_1 = require("../../utils/drawing/curve");
const types_1 = require("./types");
const defaultFormat = (n) => typeof n === 'number' ? n.toFixed(3) : n + '';
const combine = (keys, values, fmt, mergeMethod) => {
    if (keys.length !== values.length)
        return [keys, values];
    if (mergeMethod === types_1.EMergeMethod.SUM) {
        const dict = (0, array_1.unique)(keys).reduce((prev, cur) => {
            return Object.assign(Object.assign({}, prev), { [fmt(cur)]: 0 });
        }, {});
        for (let i = 0; i < keys.length; i++) {
            const key = fmt(keys[i]);
            const value = values[(0, clamp_1.clamp)(i, 0, values.length - 1)];
            dict[key] = (dict[key] || 0) + value;
        }
        return [Object.keys(dict), Object.values(dict)];
    }
    else {
        const dict = (0, array_1.unique)(keys).reduce((prev, cur) => {
            return Object.assign(Object.assign({}, prev), { [fmt(cur)]: {
                    value: 0,
                    count: 0,
                } });
        }, {});
        for (let i = 0; i < keys.length; i++) {
            const key = fmt(keys[i]);
            const value = values[(0, clamp_1.clamp)(i, 0, values.length - 1)];
            dict[key].value = (dict[key].value || 0) + value;
            dict[key].count = (dict[key].count || 0) + 1;
        }
        const nextValues = Object.values(dict).map((it) => (it.value || 0) / Math.max(1, it.count || 1));
        return [Object.keys(dict), nextValues];
    }
};
const linePlot = (lineConfig) => (args) => {
    let prevTooltipPos = args.state.tooltip.position;
    let lastHoverIndex = -1;
    const computeData = (args) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const { canvas, config } = args;
        if (config.datasets.length <= 0)
            return;
        const dataset = config.datasets[0];
        const startAtZero = !!((_a = lineConfig.yAxis) === null || _a === void 0 ? void 0 : _a.startAtZero) &&
            Math.abs(Math.min(...(dataset.values || []))) > 0.001;
        const formatX = ((_b = lineConfig.xAxis) === null || _b === void 0 ? void 0 : _b.format) || defaultFormat;
        const formatY = ((_c = lineConfig.yAxis) === null || _c === void 0 ? void 0 : _c.format) || defaultFormat;
        const keys = dataset.keys; //lineConfig.xAxis?.unique ? unique(dataset.keys) : dataset.keys;
        let [xValues, yValues] = lineConfig.mergeDuplicates
            ? combine(keys, dataset.values, formatX, lineConfig.mergeMethod || types_1.EMergeMethod.SUM)
            : [keys.map(formatX), dataset.values];
        const originalLength = yValues.length;
        if ((_d = lineConfig.xAxis) === null || _d === void 0 ? void 0 : _d.unique)
            xValues = (0, array_1.unique)(xValues);
        if (startAtZero && yValues.length > 1)
            yValues = [0, ...yValues];
        const verticalPadding = 48;
        const paddingLeft = xValues.length <= 1 ? 0 : 64;
        const plotHeight = canvas.height - verticalPadding * 2;
        const plotWidth = canvas.width - paddingLeft;
        const rds = Math.min(canvas.height, canvas.width) /
            Math.max(canvas.height, canvas.width);
        const cursorRadius = 8 * rds * (((_e = lineConfig.cursor) === null || _e === void 0 ? void 0 : _e.scale) || 1);
        const xTickCount = Math.min(((_f = lineConfig.xAxis) === null || _f === void 0 ? void 0 : _f.tickCount) || 6, xValues.length);
        const yTickCount = Math.min(((_g = lineConfig.yAxis) === null || _g === void 0 ? void 0 : _g.tickCount) || 6, yValues.length);
        const minValue = Math.min(...yValues);
        const maxValue = Math.max(...yValues);
        const valueRange = maxValue - minValue;
        const yAxisInterval = valueRange / Math.max(1, yTickCount - 1);
        const yTickValues = (0, array_1.range)(yTickCount).map((i) => minValue + yAxisInterval * i);
        const xTickValues = (0, array_1.range)(xTickCount).map((i) => xValues[(0, array_1.remapToIndex)(i, 0, xTickCount, xValues.length)]);
        const yTickLabels = yTickValues.map(formatY);
        let xTickLabels = xTickValues;
        let pointsStartIndex = 0;
        let points = yValues.map((value, i) => {
            const y = verticalPadding +
                (plotHeight - ((value - minValue) / valueRange) * plotHeight);
            const x = paddingLeft + i * (plotWidth / (yValues.length - 1));
            return (0, vector_1.VEC2)(x, y);
        });
        if (!lineConfig.stroke) {
            pointsStartIndex = 1;
            points = [
                (0, vector_1.VEC2)(paddingLeft, plotHeight + verticalPadding),
                ...points,
                (0, vector_1.VEC2)(plotWidth + paddingLeft, plotHeight + verticalPadding),
            ];
            if (yValues.length === 1) {
                points[1].y = verticalPadding * 0.5;
                points[points.length - 1].y = verticalPadding * 0.5;
                points.push((0, vector_1.VEC2)(plotWidth + paddingLeft, plotHeight + verticalPadding));
            }
        }
        const xAxisPoints = xTickLabels.map((_, i) => {
            let x = points[(0, array_1.remapToIndex)(i, 0, xTickLabels.length, points.length)].x;
            const y = canvas.height - verticalPadding / 2;
            return (0, vector_1.VEC2)(x, y);
        });
        const yAxisPoints = yTickLabels.map((_, i) => {
            const y = verticalPadding +
                (plotHeight / (yTickLabels.length - 1)) * (yTickLabels.length - i - 1);
            const x = 0;
            return (0, vector_1.VEC2)(x, y);
        });
        const getValueIndexAtX = (x) => {
            const xMin = 0;
            const remapped = x - xMin - (0 + paddingLeft);
            const index = Math.round((remapped / plotWidth) * (yValues.length - 1));
            return (0, clamp_1.clamp)(index, 0, originalLength - 1);
        };
        const getKeyIndexAtX = (x) => {
            const xMin = 0;
            const remapped = x - xMin - (0 + paddingLeft);
            const index = Math.round((remapped / plotWidth) * (xValues.length - 1));
            return (0, clamp_1.clamp)(index, 0, xValues.length - 1);
        };
        const getPointIndexAtX = (x) => {
            const xMin = 0;
            const remapped = x - xMin - (0 + paddingLeft);
            const index = Math.round((remapped / plotWidth) * (points.length - 1));
            return (0, clamp_1.clamp)(index, pointsStartIndex, Math.max(points.length - (1 + pointsStartIndex), pointsStartIndex));
        };
        const rect = canvas.getBoundingClientRect();
        return {
            getValueIndexAtX,
            getKeyIndexAtX,
            getPointIndexAtX,
            points,
            xAxisPoints,
            yAxisPoints,
            plotWidth,
            plotHeight,
            paddingLeft,
            verticalPadding,
            xTickLabels,
            yTickLabels,
            xValues,
            yValues,
            cursorRadius,
            rect,
        };
    };
    const draw = (args, plotctx) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const { canvas, config } = args;
        const { points, xAxisPoints, yAxisPoints, plotWidth, plotHeight, paddingLeft, verticalPadding, xTickLabels, yTickLabels, cursorRadius, getPointIndexAtX, } = plotctx;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = ((_a = config.styling) === null || _a === void 0 ? void 0 : _a.font) || '1rem Sans-Serif';
        const mouseLocal = args.state.mouse.localPosition;
        if ((_b = lineConfig.yAxis) === null || _b === void 0 ? void 0 : _b.drawLines) {
            // draw y-axis lines
            yAxisPoints.forEach((p, i) => {
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(plotWidth + paddingLeft, p.y);
                ctx.closePath();
                ctx.stroke();
            });
        }
        if ((_c = lineConfig.xAxis) === null || _c === void 0 ? void 0 : _c.drawLines) {
            // draw x-axis lines
            xAxisPoints.forEach((p, i) => {
                var _a, _b, _c;
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                const offset = ((_a = lineConfig.xAxis) === null || _a === void 0 ? void 0 : _a.lineHeightMinimal)
                    ? verticalPadding / 2
                    : (_c = (_b = lineConfig.xAxis) === null || _b === void 0 ? void 0 : _b.lineHeight) !== null && _c !== void 0 ? _c : plotHeight + verticalPadding;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y - offset);
                ctx.lineTo(p.x, p.y - offset + 16);
                ctx.closePath();
                ctx.stroke();
            });
        }
        switch (true) {
            case !!lineConfig.fill:
                {
                    ctx.fillStyle = ((_d = lineConfig.fill) === null || _d === void 0 ? void 0 : _d.color) || 'black';
                    ctx.strokeStyle = '';
                    if (((_e = lineConfig.fill) === null || _e === void 0 ? void 0 : _e.colorStops) &&
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
                    ctx.strokeStyle = ((_f = lineConfig.stroke) === null || _f === void 0 ? void 0 : _f.color) || 'black';
                    ctx.lineWidth = ((_g = lineConfig.stroke) === null || _g === void 0 ? void 0 : _g.width) || 1;
                    lineConfig.curve
                        ? (0, curve_1.bzCurve)(ctx, points, lineConfig.curve.f, lineConfig.curve.t)
                        : (0, curve_1.lineSegments)(ctx, points);
                    ctx.stroke();
                    ctx.lineWidth = 1;
                }
                break;
        }
        // draw y-axis labels
        yAxisPoints.forEach((p, i) => {
            var _a;
            ctx.fillStyle = ((_a = config.styling) === null || _a === void 0 ? void 0 : _a.textColor) || 'black';
            ctx.beginPath();
            ctx.fillText(yTickLabels[(0, clamp_1.clamp)(i, 0, yTickLabels.length - 1)], p.x, p.y - 2);
            ctx.closePath();
        });
        // draw x-axis labels
        xAxisPoints.forEach((p, i) => {
            var _a, _b;
            let x = p.x;
            const m = ctx.measureText(xTickLabels[i]);
            if ((_a = lineConfig.xAxis) === null || _a === void 0 ? void 0 : _a.centerLabels) {
                x -= m.width * 0.5;
            }
            x = (0, clamp_1.clamp)(x, 0, canvas.width - m.width);
            ctx.fillStyle = ((_b = config.styling) === null || _b === void 0 ? void 0 : _b.textColor) || 'black';
            ctx.beginPath();
            ctx.fillText(xTickLabels[i], x, p.y + 2);
            ctx.closePath();
        });
        const pointIndex = getPointIndexAtX(mouseLocal.x);
        const point = points[pointIndex];
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(point.x, plotHeight + verticalPadding);
        ctx.lineTo(point.x, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = ((_h = lineConfig.cursor) === null || _h === void 0 ? void 0 : _h.color) || 'black';
        ctx.beginPath();
        ctx.arc(point.x, point.y, cursorRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    };
    const updateTooltip = (args, plotctx) => {
        const { xValues, yValues, cursorRadius, rect, getKeyIndexAtX, getValueIndexAtX, getPointIndexAtX, points, } = plotctx;
        const mouseLocal = args.state.mouse.localPosition;
        const pointIndex = getPointIndexAtX(mouseLocal.x);
        const keyIndex = getKeyIndexAtX(mouseLocal.x);
        const valueIndex = getValueIndexAtX(mouseLocal.x);
        const point = points[pointIndex];
        args.state.tooltip.text = `${yValues[valueIndex]}`;
        const nextTooltipPos = prevTooltipPos.lerp(point
            .mul(args.state.dimensions.ratioInverse)
            .add((0, vector_1.VEC2)(rect.x, rect.y - 16))
            .add((0, vector_1.VEC2)(0, -(32 + 2 * cursorRadius + 0.5 * args.state.tooltip.rect.height))), (0, clamp_1.clamp)(args.app.state.time.delta * 8, 0, 1));
        prevTooltipPos = nextTooltipPos;
        args.state.tooltip.position = nextTooltipPos;
        if (args.hooks) {
            const { onDataHover } = args.hooks;
            if (onDataHover) {
                if (valueIndex !== lastHoverIndex) {
                    onDataHover(args.app, xValues[keyIndex], yValues[valueIndex], valueIndex);
                    lastHoverIndex = valueIndex;
                }
            }
        }
    };
    let plotctx = undefined;
    const getContext = (args) => {
        if (plotctx)
            return plotctx;
        const context = computeData(args);
        plotctx = context;
        return context;
    };
    return {
        update: (args) => {
            const context = getContext(args);
            plotctx = context;
            draw(args, context);
            updateTooltip(args, context);
        },
        reload: (_args) => {
            plotctx = undefined;
        },
    };
};
exports.linePlot = linePlot;
