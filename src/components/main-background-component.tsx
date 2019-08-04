import React from 'react'
import { StandardProperties } from 'csstype';
import { cloneDeep } from 'lodash';
import { COLORS } from '../util';
import dots from './../assets/dots-small.svg';

export default function CardBgComponent(props?: { dotColor?: string, type?: 'linear' | 'radial', bgColor?: string, style?: StandardProperties }) {
    const background = `url("${dots}")`;
    const dotColor = props!.dotColor || COLORS.BACKGROUND;
    const type = props!.type || 'linear';
    const bgColor = props!.bgColor || 'transparent';
    const style = props ? (props.style || {}) : {};

    return (
        <div style={Object.assign(style, { position: 'absolute', backgroundColor: bgColor, width: '100%', height: '100%', zIndex: -5, left: '0px', top: '0px' })}>
            <div style={{
                position: 'absolute',
                left: '0px',
                height: '100%',
                zIndex: -4,
                width: '100%',
                backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px), radial-gradient(${dotColor} 1px, transparent 1px)`,
                backgroundPosition: '0 0, 25px 25px',
                backgroundSize: '50px 50px'
            }}> </div>
            {type == 'linear' && <div style={{ position: 'absolute', height: '100%', zIndex: -3, width: '100%', background: `linear-gradient(to bottom, #ffffff00, #ffffff)` }}></div>}
            {type == 'radial' && <div style={{ position: 'absolute', height: '100%', zIndex: -3, width: '100%', background: `radial-gradient(#ffffff, #ffffff00)` }}></div>}
        </div>
    );

    return (
        <div style={Object.assign(cloneDeep(CommonStyles), { background, transform: undefined, borderRadius: '5px' })}>
            {/* <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.05, top: '75%', left: '0%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.1, top: '50%', left: '15%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.09, top: '25%', left: '30%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.15, top: '0%', left: '46%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.16, top: '-25%', left: '61%' })}></div>
            <div style={Object.assign(cloneDeep(CommonStyles), { opacity: 0.08, top: '-50%', left: '76%' })}></div> */}
        </div>
    )
}

export const MainBgContainerStyles: StandardProperties = {
    padding: '20px 30px',
    color: COLORS.BACKGROUND,
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
