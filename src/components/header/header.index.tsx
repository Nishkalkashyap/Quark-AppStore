import React, { Component } from 'react'
import { StandardProperties } from 'csstype';
import logo from './../../assets/logo.svg';

export default class Header extends Component {
    render() {
        return (
            <div style={HeaderStyle}>
                <img src={logo} alt="logo" style={{ maxWidth: '35px', marginLeft : '20px' }} />
                <h1 style={{ margin: '7px 10px 0px 10px', 'height' : '100%', verticalAlign : 'middle' }}>Dashboard</h1>
            </div>
        )
    }
}

const HeaderStyle: StandardProperties = {
    color: 'black',
    display : 'flex',
    alignItems : 'center',
    height : '56px',
    borderBottom: `1px solid var(--border-color)`
}