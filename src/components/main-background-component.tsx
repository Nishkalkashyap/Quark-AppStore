import React from 'react'
import { StandardProperties } from 'csstype';
import { cloneDeep } from 'lodash';

export default function MainBgComponent() {
    return (
        <div style={Object.assign({}, CommonStyles, { backgroundImage: 'linear-gradient(90deg,#2196F3 0,#21CBF3 100%)', transform: undefined })}>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.05, top: '75%', left: '0%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.1, top: '50%', left: '15%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.09, top: '25%', left: '30%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.15, top: '0%', left: '46%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.16, top: '-25%', left: '61%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.08, top: '-50%', left: '76%' })}></div>
        </div>
    )
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
    transformOrigin: 'top'
}
