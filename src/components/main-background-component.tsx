import React from 'react'
import { StandardProperties } from 'csstype';
import { cloneDeep } from 'lodash';
import { PRIMARY_COLOR, PRIMARY_COLOR_LIGHT, ON_PRIMARY_COLOR } from '../util';

export default function MainBgComponent(props?: { bgColor?: string, position?: 'fixed' | 'absolute' }) {
    // const color = props!.bgColor ? props!.bgColor : 'linear-gradient(90deg,#2196F3 0,#21CBF3 100%)';
    // const color = props!.bgColor ? props!.bgColor : 'linear-gradient(90deg,PRIMARY_COLOR 0,#21CBF3 100%)';
    // const color = props!.bgColor ? props!.bgColor : 'linear-gradient(90deg,#000000ff 0,#000000aa 100%)';
    // const color = 'linear-gradient(90deg,#ffffffff 0,#99999999 100%)';
    const backgroundColor = `linear-gradient(90deg,${PRIMARY_COLOR} 0,${PRIMARY_COLOR_LIGHT} 100%)`;
    const position = props!.position ? props!.position : 'absolute';
    return (
        <div style={Object.assign(cloneDeep(CommonStyles), { background: backgroundColor, transform: undefined, borderRadius: '5px', position })}>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.05, top: '75%', left: '0%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.1, top: '50%', left: '15%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.09, top: '25%', left: '30%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.15, top: '0%', left: '46%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.16, top: '-25%', left: '61%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.08, top: '-50%', left: '76%' })}></div>
        </div>
    )
}

export const MainBgContainerStyles: StandardProperties = {
    padding: '20px 30px',
    color: ON_PRIMARY_COLOR,
    position: 'relative',
    zIndex: 20
}

const CommonStyles: StandardProperties = {
    width: 'calc(100% - 0px)',
    height: 'calc(100% - 0px)',
    position: 'absolute',
    top: '0px',
    left: '0px',
    zIndex: -10,
    overflow: 'hidden',
    backgroundImage: 'linear-gradient(90deg,#fff 0,rgba(255,255,255,0) 75%)',
    transform: `translate(-20px,0) rotate(-3deg) skew(16deg,0deg) scale(1,1.5)`,
    transformOrigin: 'top',
}
