import React from 'react'
import { Typography, Link } from '@material-ui/core';
import { COLORS } from '../util';
import { StandardProperties } from 'csstype';

export function FooterComponent() {
    return (
        <footer style={footerStyle}>
            <div style={linksDivStyle}>
                <Typography style={{ marginBottom: '15px' }}>
                    GitHub
                </Typography>
                <Link target="_blank" href="https://github.com/Nishkalkashyap/Quark-electron" style={linkStyle}>Quark: Build</Link>
                <Link target="_blank" href="https://github.com/Nishkalkashyap/Quark-docs" style={linkStyle}>Quark: Docs</Link>
                <Link target="_blank" href="https://github.com/Nishkalkashyap/Quark-appstore" style={linkStyle}>Quark: Appstore</Link>
                <Link target="_blank" href="https://github.com/Nishkalkashyap/Quark-samples" style={linkStyle}>Quark: Examples</Link>
            </div>
            <div style={centerDivStyle}>
                <Typography variant="body2">
                    You've hit rock bottom. Find an issue?
                <Link target="_blank" href="https://github.com/Nishkalkashyap/Quark-appstore" style={linkStyle}>Submit a fix on Github</Link>
                </Typography>
                <div>
                    <Typography variant="body2">
                    Copyright © 2019
                    <Link target="_blank" href="mailto:hello@nishkal.in?subject=Hello%20Nishkal" style={{cursor : 'pointer'}}>&nbsp;Nishkal Kashyap.&nbsp;</Link>
                    All rights reserved.
                    </Typography>
                </div>
                <div onClick={() => window.open('https://quarkjs.io/download/')} style={{ display: 'inline-block', color: COLORS.ON_PRIMARY, marginTop: '50px', padding: '20px 40px', backgroundColor: COLORS.PRIMARY, fontSize: '1.6em', borderRadius: '2px', fontFamily: 'var(--heading-font-family)', cursor: 'pointer' }}>
                    Download Quark
                </div>
            </div>
            <div style={linksDivStyle}>
                <Typography style={{ marginBottom: '15px' }}>
                    Links
                </Typography>
                <Link target="_blank" href="https://medium.com/hackernoon/announcing-quark-a-software-sketchbook-for-your-projects-2f53553415b" style={linkStyle}>Medium</Link>
                <Link target="_blank" href="https://quarkjs.io" style={linkStyle}>Documentation</Link>
                <Link target="_blank" href="https://quarkjs.io/FAQ/terms-of-service.html" style={linkStyle}>Terms of service</Link>
                <Link target="_blank" href="https://quarkjs.io/FAQ/about.html" style={linkStyle}>About</Link>
                <Link target="_blank" href="mailto:hello@nishkal.in?subject=Hello%20Nishkal" style={linkStyle}>Contact</Link>
            </div>
        </footer>
    )
}

const footerStyle: StandardProperties = {
    padding: '50px 0px',
    backgroundColor: COLORS.BACKGROUND,
    color: COLORS.ON_BACKGROUND,
    borderLeft: `solid 1px ${COLORS.ON_BACKGROUND}33`,
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap : 'wrap',
    textAlign: 'center',
    marginTop : '100px'
}

const centerDivStyle: StandardProperties = {
    textAlign: 'center',
    margin: '20px 20px',
    flexGrow: 2
}

const linksDivStyle: StandardProperties = {
    margin: '20px 20px',
    flexGrow: 1
}

const linkStyle: StandardProperties = {
    display: 'block',
    cursor: 'pointer',
    margin: '5px 0px'
}