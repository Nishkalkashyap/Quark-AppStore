import React from 'react';
import { getSvgs } from '../data/svgs';

export function SwagBackgroundComponent() {

    const svgs = getSvgs();

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
