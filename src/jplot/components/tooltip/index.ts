import { TooltipPropsInternal } from './types';
import { VEC2 } from '../../math/vector';
import { X } from 'xel';
import { pxToRemStr, remToPx } from '../../utils/style';

//const shadow = `0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)`;
const shadowFilter = `drop-shadow(0px 2px 4px rgba(0,0,0, 0.5));`;

//const shadowFilter = `drop-shadow(0px 2px 4px rgba(0,0,0, 0.5));`

export const Tooltip = (args: TooltipPropsInternal) => X<TooltipPropsInternal, TooltipPropsInternal>('div', {
  initialState: {
    position: VEC2(0, 0),
    opacity: 1,
  },
  render(props, state, callee): any {
    const minHeight = 8
    const minWidth = 160

    const x = state.position.x - 10
    const y = state.position.y - remToPx(minHeight * 0.75)
    const ys = `${y}px`
    const xs = `${x}px`
    const tipWidth = 8
    const tipHeight = 8

    return X('div', {
      cname: 'tooltip',
      ...args,
      style: {
        filter: shadowFilter,
        position: 'fixed',
        zIndex: 99,
        top: ys,
        left: xs,
        width: 'fit-content',
        height: 'fit-content',
        minWidth: pxToRemStr(minWidth),
        minHeight: pxToRemStr(minHeight),
        background: 'white',
        userSelect: 'none',
        opacity: `${state.opacity * 100.0}%`,
        pointerEvents: 'none'
      },
      children: [
        X('div', {
          cname: 'tooltip-sheet',
          stylesheet: {
            //padding: '0.25rem',
            position: 'relative',
            width: 'fit-content',
            height: 'fit-content',
            borderRadius: '0.2rem',
            minWidth: pxToRemStr(minWidth),
            minHeight: pxToRemStr(minHeight),
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
          children: [X('div', {
            style: {
              width: 'fit-content',
              pointerEvents: 'none'
            },
            render() {
              return state.body || state.text || 'hello world'
            }
          })]
        })
      ]
    })
  }
})
