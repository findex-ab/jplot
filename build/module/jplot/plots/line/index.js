import { range, remapToIndex, unique } from '../../utils/array';
import { clamp } from '../../math/clamp';
import { VEC2 } from '../../math/vector';
import { bzCurve, lineSegment, lineSegments } from '../../utils/drawing/curve';
import { EMergeMethod } from './types';
const defaultFormat = (n) => typeof n === 'number' ? n.toFixed(3) : n + '';
const combine = (keys, values, fmt, mergeMethod) => {
    if (keys.length !== values.length)
        return [keys, values];
    if (mergeMethod === EMergeMethod.SUM) {
        const dict = unique(keys).reduce((prev, cur) => {
            return {
                ...prev,
                [fmt(cur)]: 0
            };
        }, {});
        for (let i = 0; i < keys.length; i++) {
            const key = fmt(keys[i]);
            const value = values[clamp(i, 0, values.length - 1)];
            dict[key] += value;
        }
        return [Object.keys(dict), Object.values(dict)];
    }
    else {
        const dict = unique(keys).reduce((prev, cur) => {
            return {
                ...prev,
                [fmt(cur)]: {
                    value: 0,
                    count: 0
                }
            };
        }, {});
        for (let i = 0; i < keys.length; i++) {
            const key = fmt(keys[i]);
            const value = values[clamp(i, 0, values.length - 1)];
            dict[key].value += value;
            dict[key].count += 1;
        }
        const nextValues = Object.values(dict).map(it => it.value / Math.max(1, it.count));
        return [Object.keys(dict), nextValues];
    }
};
export const linePlot = (lineConfig) => (args) => {
    let prevTooltipPos = args.state.tooltip.position;
    let lastHoverIndex = -1;
    return (args) => {
        const { canvas, config } = args;
        if (config.datasets.length <= 0)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = config.styling?.font || '1rem Sans-Serif';
        const formatX = lineConfig.xAxis?.format || defaultFormat;
        const formatY = lineConfig.yAxis?.format || defaultFormat;
        const dataset = config.datasets[0];
        const keys = dataset.keys; //lineConfig.xAxis?.unique ? unique(dataset.keys) : dataset.keys;
        let [xValues, yValues] = lineConfig.mergeDuplicates ? combine(keys, dataset.values, formatX, lineConfig.mergeMethod || EMergeMethod.SUM) : [keys.map(formatX), dataset.values];
        if (lineConfig.xAxis?.unique)
            xValues = unique(xValues);
        const verticalPadding = 48;
        const paddingLeft = xValues.length <= 1 ? 0 : 64;
        const plotHeight = canvas.height - verticalPadding * 2;
        const plotWidth = canvas.width - paddingLeft;
        const rect = canvas.getBoundingClientRect();
        const rx = canvas.width / rect.width;
        const ry = canvas.height / rect.height;
        const mouseLocal = args.state.mouse.localPosition;
        const rds = Math.min(canvas.height, canvas.width) /
            Math.max(canvas.height, canvas.width);
        const cursorRadius = 8 * rds * (lineConfig.cursor?.scale || 1);
        //const xValues = dataset.keys;
        //const yValues = dataset.values;
        const xTickCount = Math.min(lineConfig.xAxis?.tickCount || 6, xValues.length);
        const yTickCount = Math.min(lineConfig.yAxis?.tickCount || 6, yValues.length);
        const minValue = Math.min(...yValues);
        const maxValue = Math.max(...yValues);
        const valueRange = maxValue - minValue;
        const yAxisInterval = valueRange / (yTickCount - 1);
        const yTickValues = range(yTickCount).map((i) => minValue + yAxisInterval * i);
        const xTickValues = range(xTickCount).map((i) => xValues[remapToIndex(i, 0, xTickCount, xValues.length)]);
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
        let pointsStartIndex = 0;
        let points = yValues.map((value, i) => {
            const y = verticalPadding +
                (plotHeight - ((value - minValue) / valueRange) * plotHeight);
            const x = paddingLeft + i * (plotWidth / (yValues.length - 1));
            return VEC2(x, y);
        });
        if (!lineConfig.stroke) {
            pointsStartIndex = 1;
            points = [VEC2(paddingLeft, plotHeight + verticalPadding), ...points, VEC2(plotWidth + paddingLeft, plotHeight + verticalPadding)];
        }
        const xAxisPoints = xTickLabels.map((_, i) => {
            let x = points[remapToIndex(i, 0, xTickLabels.length, points.length)].x; //paddingLeft + plotWidth * (i / xTickLabels.length);
            const y = canvas.height - verticalPadding / 2;
            //if (lastPointFix && i >= xTickLabels.length-1) {
            //  x = plotWidth + paddingLeft;
            //}
            return VEC2(x, y);
        });
        const yAxisPoints = yTickLabels.map((_, i) => {
            const y = verticalPadding +
                (plotHeight / (yTickLabels.length - 1)) * (yTickLabels.length - i - 1);
            const x = 0;
            return VEC2(x, y);
        });
        if (lineConfig.yAxis?.drawLines) {
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
        if (lineConfig.xAxis?.drawLines) {
            // draw x-axis lines
            xAxisPoints.forEach((p, i) => {
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x, p.y - (lineConfig.xAxis?.lineHeightMinimal ? (verticalPadding / 2) : (lineConfig.xAxis?.lineHeight ?? (plotHeight + verticalPadding))));
                ctx.closePath();
                ctx.stroke();
            });
        }
        switch (true) {
            case !!lineConfig.fill:
                {
                    ctx.fillStyle = lineConfig.fill?.color || 'black';
                    ctx.strokeStyle = '';
                    if (lineConfig.fill?.colorStops &&
                        lineConfig.fill.colorStops.length > 0) {
                        const gradient = ctx.createLinearGradient(0, 0, 0, plotHeight * 2);
                        lineConfig.fill.colorStops.forEach((stop) => gradient.addColorStop(stop.stop, stop.color));
                        ctx.fillStyle = gradient;
                    }
                    lineConfig.curve
                        ? bzCurve(ctx, points, lineConfig.curve.f, lineConfig.curve.t)
                        : lineSegment(ctx, points);
                    //bzCurve(ctx, points);
                    ctx.fill();
                }
                break;
            default:
            case !!lineConfig.stroke:
                {
                    ctx.strokeStyle = lineConfig.stroke?.color || 'black';
                    ctx.lineWidth = lineConfig.stroke?.width || 1;
                    lineConfig.curve
                        ? bzCurve(ctx, points, lineConfig.curve.f, lineConfig.curve.t)
                        : lineSegments(ctx, points);
                    ctx.stroke();
                    ctx.lineWidth = 1;
                }
                break;
        }
        // draw y-axis labels
        yAxisPoints.forEach((p, i) => {
            ctx.fillStyle = config.styling?.textColor || 'black';
            ctx.beginPath();
            ctx.fillText(yTickLabels[i], p.x, p.y);
            ctx.closePath();
        });
        // if (xValues.length > 0 && xAxisPoints.length >= 0) {
        //   const lastLabel = xValues[xValues.length-1];
        //   let p = xAxisPoints[xAxisPoints.length-1].clone();
        //   p.x = plotWidth + paddingLeft;
        //   if (!xTickLabels.includes(lastLabel)) {
        //     ctx.fillStyle = config.styling?.textColor || 'black';
        //     const m = ctx.measureText(lastLabel);
        //     p.x -= m.width;
        //     ctx.beginPath();
        //     ctx.fillText(lastLabel, p.x, p.y);
        //     ctx.closePath();
        //   }
        // }
        // draw x-axis labels
        xAxisPoints.forEach((p, i) => {
            let x = p.x;
            const m = ctx.measureText(xTickLabels[i]);
            if (lineConfig.xAxis?.centerLabels) {
                x -= m.width * 0.5;
            }
            x = clamp(x, 0, canvas.width - m.width);
            ctx.fillStyle = config.styling?.textColor || 'black';
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
            return clamp(index, 0, yValues.length - 1);
        };
        const getKeyIndexAtX = (x, xMin) => {
            const remapped = x - xMin - (0 + paddingLeft); // Adjust for padding
            const index = Math.round((remapped / plotWidth) * (xValues.length - 1));
            return clamp(index, 0, xValues.length - 1);
        };
        const getPointIndexAtX = (x, xMin) => {
            const remapped = x - xMin - (0 + paddingLeft); // Adjust for padding
            const index = Math.round((remapped / plotWidth) * (points.length - 1));
            return clamp(index, pointsStartIndex, Math.max(points.length - (1 + pointsStartIndex), pointsStartIndex));
        };
        //const mx = (args.state.mouse.position.x - rect.x) / rect.width;
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
            .add(VEC2(rect.x, rect.y - 16)).add(VEC2(0, -(32 + (2 * cursorRadius) + (0.5 * args.state.tooltip.rect.height)))), clamp(args.app.state.time.delta * 8, 0, 1));
        prevTooltipPos = nextTooltipPos;
        args.state.tooltip.position = nextTooltipPos;
        ctx.fillStyle = lineConfig.cursor?.color || 'black';
        ctx.beginPath();
        ctx.arc(point.x, point.y, cursorRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
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
};
