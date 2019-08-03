import React from 'react';
import { getSvgs, darkSvgs } from '../data/svgs';
/* eslint import/no-webpack-loader-syntax: off */
import '!!style-loader!css-loader!stylus-loader!./../styles/mixins.styl';

export function SwagBackgroundComponent() {

    const svgs = getSvgs().concat(darkSvgs);

    return (
        <div></div>
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
