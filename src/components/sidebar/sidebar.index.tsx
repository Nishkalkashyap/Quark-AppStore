import React, { Component } from 'react'
import { StandardProperties } from 'csstype';
import logo from './../../logo.svg';

interface SidebarItems {
    label: string;
    icon?: string;
}

export default class Sidebar extends Component {

    icons: SidebarItems[] = [{
        label: 'Dashboard',
        icon: logo
    }]

    render() {
        return (
            <div style={SidebarContainerStyle}>
                {this.icons.map((item) => {
                    return (
                        <div className="logo sfdsf" key={item.icon}>
                            <img src={item.icon} alt={item.label} style={{ marginTop: '20px' }} />
                        </div>
                    )
                })}
            </div>
        )
    }
}

const SidebarContainerStyle: StandardProperties = {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    width: '56px',
    height: '100%',
    borderRight: `1px solid var(--border-color)`
}
