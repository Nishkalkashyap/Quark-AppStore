import React from 'react'
import { Typography, Link, Button } from '@material-ui/core';
import { COLORS } from '../util';
import { basePropType } from '../basePropType';
import { StandardProperties, WritingModeProperty, SvgProperties } from 'csstype';
import CardBgComponent from './main-background-component';

export function FooterComponent() {
    return (
        <footer style={{ textAlign: 'center', marginTop: '100px', position: 'relative', padding: '50px 0px' }}>
            <Typography variant="body2">
                You've hit rock bottom. Find an issue?
                <Link target="_blank" href="https://github.com/Nishkalkashyap/Quark-appstore" style={{ cursor: 'pointer', marginLeft: '5px' }}>Submit a fix on Github</Link>
            </Typography>
            <div>
                <Typography variant="body2">
                    Copyright © 2019 Nishkal Kashyap. All rights reserved.
                </Typography>
            </div>
            <div onClick={() => window.open('https://quarkjs.io/download/')} style={{ display: 'inline-block', color: COLORS.ON_PRIMARY, marginTop: '50px', padding: '20px 40px', backgroundColor: COLORS.PRIMARY, fontSize: '2em', borderRadius: '2px', fontFamily: 'var(--heading-font-family)', cursor: 'pointer' }}>
                Download Quark
            </div>
            {/* <CardBgComponent /> */}
            {/* <svg style={svgStyles} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 338.05" preserveAspectRatio="none">
                <path>
                    <animate
                        attributeName="d"
                        values="M 0 100 Q 250 50 400 200 Q 550 350 800 300 L 800 0 L 0 0 L 0 100 Z;M 0 100 Q 200 150 400 200 Q 600 250 800 300 L 800 0 L 0 0 L 0 100 Z;M 0 100 Q 150 350 400 200 Q 650 50 800 300 L 800 0 L 0 0 L 0 100 Z"
                        repeatCount="indefinite"
                        dur="30s"
                    />
                </path>
            </svg> */}
        </footer>
    )
}

const svgStyles: StandardProperties & SvgProperties = {
    transform: 'scale(1, -0.5)',
    bottom: '0px',
    left: '0px',
    zIndex: -2,
    position: 'absolute',
    fill: '#6574cd99'
};
