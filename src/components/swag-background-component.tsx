import React from 'react';
import { getSvgs, darkSvgs } from '../data/svgs';
/* eslint import/no-webpack-loader-syntax: off */
import '!!style-loader!css-loader!stylus-loader!./../styles/mixins.styl';
import { COLORS } from '../util';

export function SwagBackgroundComponent() {

    const svgs = getSvgs().concat(darkSvgs);
    // const dotColor = COLORS.PRIMARY;
    const dotColor = `#999999`;

    return (
        <div style={{ position: 'absolute', width: '100%', height: '100vh', zIndex: -5 }}>
            {/* <div style={{ position: 'absolute', zIndex: -3 }} className="swag-background">
                {
                    svgs.map((_svg, index) => {
                        return (<svg key={_svg.svg.shape + index} dangerouslySetInnerHTML={{ __html: _svg.svg.shape }} className={`${_svg.svg.className} random-svg`} viewBox={_svg.svg.viewBox} style={_svg.style} />)
                    })
                }
            </div> */}
            <div style={{ position: 'absolute', height: '100%', zIndex: -4, width: '100%', background: `linear-gradient(to bottom, #ffffff00, #ffffff)` }}></div>
            <div style={{ position: 'absolute', height: '100%', zIndex: -5, width: '100%', backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px), radial-gradient(${dotColor} 1px, transparent 1px)`, backgroundPosition: '0 0, 25px 25px', backgroundSize: '50px 50px' }}> </div>
            {/* <div style={{ position: 'absolute', height: '100%', zIndex: -5, width: '100%', background: `url("${dots}")`, backgroundSize: '30px' }}> </div> */}
        </div>
    )
}
