import React, { Component } from 'react'
import { StandardProperties } from 'csstype';
import logo from './../../assets/logo.svg';
import { withFirebase } from '../../services/firebase/firebase.index';
import { basePropType } from '../login/signup';

class Header extends Component<basePropType> {
    render() {
        return (
            <div style={HeaderStyle}>
                <img src={logo} alt="logo" style={InageStyles} />
                <h3 style={{ margin: '0px 10px 0px 10px', verticalAlign: 'middle', fontSize: '1.3rem' }}>Dashboard</h3>
            </div>
        )
    }
}

export default withFirebase(Header);

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