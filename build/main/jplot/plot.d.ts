import { type PlotAppConfig, type PlotAppState } from './types';
export declare const plot: (config: PlotAppConfig) => {
    destroy: () => void;
    state: PlotAppState;
    root: import("xel").XElement<{
        style: {
            width: string;
            height: string;
        };
        children: (HTMLCanvasElement | import("xel").XElement<import("./components/tooltip/types").TooltipPropsInternal, import("./components/tooltip/types").TooltipPropsInternal>)[];
    }, import("xel").XAnyObject>;
    reload: () => void;
};
