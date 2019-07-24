import React, { Component } from 'react'
import { StandardProperties } from 'csstype';
import logo from './../../assets/logo.svg';

export default class Header extends Component {
    render() {
        return (
            <div style={HeaderStyle}>
                <img src={logo} alt="logo" style={InageStyles} />
                <h3 style={{ margin: '0px 10px 0px 10px', verticalAlign: 'middle', fontSize: '1.3rem' }}>Dashboard</h3>
            </div>
        )
    }
}

const HeaderStyle: StandardProperties = {
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    height: '56px',
    borderBottom: `1px solid var(--border-color)`,
    cursor: 'pointer'
}

const InageStyles: StandardProperties = {
    maxWidth: '35.2px',
    marginLeft: '24px',
    // marginRight: '24px',
    // borderRight: `1px solid var(--border-color)`,
}