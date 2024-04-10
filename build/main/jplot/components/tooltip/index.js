"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tooltip = void 0;
const vector_1 = require("../../math/vector");
const xel_1 = require("xel");
const style_1 = require("../../utils/style");
//const shadow = `0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)`;
const shadowFilter = `drop-shadow(0px 2px 4px rgba(0,0,0, 0.5));`;
//const shadowFilter = `drop-shadow(0px 2px 4px rgba(0,0,0, 0.5));`
const Tooltip = (args) => (0, xel_1.X)('div', {
    initialState: {
        position: (0, vector_1.VEC2)(0, 0),
        opacity: 1,
    },
    render(props, state, callee) {
        const minHeight = 8;
        const minWidth = 160;
        const x = state.position.x - 10;
        const y = state.position.y - (0, style_1.remToPx)(minHeight * 0.75);
        const ys = `${y}px`;
        const xs = `${x}px`;
        const tipWidth = 8;
        const tipHeight = 8;
        return (0, xel_1.X)('div', Object.assign(Object.assign({ cname: 'tooltip' }, args), { style: {
                filter: shadowFilter,
                position: 'fixed',
                zIndex: 99,
                top: ys,
                left: xs,
                width: 'fit-content',
                height: 'fit-content',
                minWidth: (0, style_1.pxToRemStr)(minWidth),
                minHeight: (0, style_1.pxToRemStr)(minHeight),
                background: 'white',
                userSelect: 'none',
                opacity: `${state.opacity * 100.0}%`
            }, children: [
                (0, xel_1.X)('div', {
                    cname: 'tooltip-sheet',
                    stylesheet: {
                        //padding: '0.25rem',
                        position: 'relative',
                        width: 'fit-content',
                        height: 'fit-content',
                        borderRadius: '0.2rem',
                        minWidth: (0, style_1.pxToRemStr)(minWidth),
                        minHeight: (0, style_1.pxToRemStr)(minHeight),
                        pointerEvents: 'none',
                        background: 'white',
                        userSelect: 'none',
                        '&:after': {
                            content: '',
                            display: 'inline-block',
                            borderStyle: 'solid',
                            borderWidth: `${tipHeight}px ${tipWidth}px 0`,
                            borderColor: 'white transparent',
                            borderRadius: '2px',
                            position: 'absolute',
                            bottom: `-${tipHeight - 0.3}px`,
                            left: `${tipWidth * 0.5}px`
                        }
                    },
                    children: [(0, xel_1.X)('div', {
                            style: {
                                width: 'fit-content'
                            },
                            render() {
                                return state.body || state.text || 'hello world';
                            }
                        })]
                })
            ] }));
    }
});
exports.Tooltip = Tooltip;
