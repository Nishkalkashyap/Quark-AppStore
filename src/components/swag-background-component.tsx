import React from 'react';
import { getSvgs, darkSvgs } from '../data/svgs';
/* eslint import/no-webpack-loader-syntax: off */
import '!!style-loader!css-loader!stylus-loader!./../styles/mixins.styl';
import { cloneDeep } from 'lodash';
import dots from './../assets/dots-small.svg';

export function SwagBackgroundComponent() {

    const svgs = getSvgs().concat(darkSvgs);

    // return (
    //     <div style={{ background: `url("${dots}")`, position: 'absolute', width: '100%', height: '100vh', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))' }}>
    //     </div>
    // )
    return (
        <div style={{ position: 'absolute', width: '100%', height: '100vh', zIndex : -2 }}>
            <div style={{ position : 'absolute', height: '100%',width : '100%', background: `url("${dots}")` }}> </div>
            <div style={{ position : 'absolute', height: '100%',width : '100%', background: 'linear-gradient(to bottom, #ffffff00, #ffffff)' }}></div>
        </div>
    )

    return (
        <div style={{ position: 'absolute', zIndex: -2 }} className="swag-background">
            {
                svgs.map((_svg, index) => {
                    return (<svg key={_svg.svg.shape + index} dangerouslySetInnerHTML={{ __html: _svg.svg.shape }} className={`${_svg.svg.className} random-svg`} viewBox={_svg.svg.viewBox} style={_svg.style} />)
                })
            }
        </div>
    )
}
