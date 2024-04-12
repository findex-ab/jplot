import { PlotFunction } from "../../types";
import { ColorStop } from '../../colors/types';

export type LinePlotStrokeConfig = {
  color: string;
  width?: number;
}

export type LinePlotFillConfig = {
  color?: string;
  colorStops?: ColorStop[];
}

export type LineCurveConfig = {
  f?: number;
  t?: number;
}

export type PlotAxis = {
  tickCount?: number;
  format?: (value: string | number) => string;
  unique?: boolean;
  centerLabels?: boolean;
  drawLines?: boolean;
  lineHeight?: number;
  lineHeightMinimal?: boolean;
}

export type LinePlotCursorConfig = {
  scale?: number;
  color?: string;
}

export enum EMergeMethod {
  AVERAGE = "AVERAGE",
  SUM = "SUM"
}

export type LinePlotConfig = {
  stroke?: LinePlotStrokeConfig;
  fill?: LinePlotFillConfig;
  curve?: LineCurveConfig;
  xAxis?: PlotAxis;
  yAxis?: PlotAxis;
  cursor?: LinePlotCursorConfig;
  mergeDuplicates?: boolean;
  mergeMethod?: EMergeMethod;
}

export type LinePlotFunction = (config: LinePlotConfig) => PlotFunction;
