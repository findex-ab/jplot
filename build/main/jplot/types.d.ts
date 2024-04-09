import { IVector, Vector } from './math/vector';
import { TooltipProps } from './components/tooltip/types';
import { XElement } from 'xel';
import { SetStateFunction } from './utils/reactivity/useState';
export type PlotValue = string | number;
export type PlotDataSet = {
    keys: string[];
    values: number[];
};
export type PlotConfig = {
    datasets: PlotDataSet[];
};
export type PlotArguments = {
    canvas: HTMLCanvasElement;
    config: PlotAppConfig;
    state: PlotAppState;
    hooks?: PlotAppConfigHooks;
    app: PlotApp;
};
export type PlotUpdateFunction = (args: PlotArguments) => void;
export type PlotFunction = (args: PlotArguments) => PlotUpdateFunction;
export type PlotAppConfigHooks = {
    onDataHover: (app: PlotApp, key: string, value: number) => void;
};
export type PlotAppStylingConfig = {
    font?: string;
};
export type PlotAppConfig = PlotConfig & {
    plot: PlotFunction;
    canvasResolution?: IVector;
    canvasSize?: {
        x: string | number;
        y: string | number;
    };
    fitParent?: boolean;
    hooks?: PlotAppConfigHooks;
    disableWhenMouseOutside?: boolean;
    styling?: PlotAppStylingConfig;
};
export type PlotAppStateMouse = {
    position: Vector;
    localPosition: Vector;
};
export type PlotAppStateTime = {
    now: number;
    delta: number;
    lastFrame: number;
    started: number;
};
export type PlotAppStateDimensions = {
    ratio: Vector;
    ratioInverse: Vector;
};
export type PlotAppStateTooltip = Partial<TooltipProps> & {
    xel?: XElement;
    position: Vector;
};
export type PlotAppState = {
    root: XElement;
    canvas: HTMLCanvasElement;
    mouse: PlotAppStateMouse;
    time: PlotAppStateTime;
    dimensions: PlotAppStateDimensions;
    tooltip: PlotAppStateTooltip;
    disabled: boolean;
    animationId: number | null;
    fun?: PlotUpdateFunction;
    loading: boolean;
};
export type PlotApp = {
    state: PlotAppState;
    setState: SetStateFunction<PlotAppState>;
};
