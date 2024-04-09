import { XElement } from 'xel';
import { Vector } from '../../math/vector';
export type TooltipProps = {
    body?: XElement;
    text?: string;
};
export type TooltipPropsInternal = TooltipProps & {
    position: Vector;
    el?: HTMLElement;
    opacity?: number;
};
