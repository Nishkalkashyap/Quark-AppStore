import React, { Component } from 'react'
import { StandardProperties } from 'csstype';
import logo from './../../logo.svg';
import { T } from '../login/signup';
import { FirebaseContext } from '../../services/firebase/firebase.index';
import { ROUTES } from '../../data/routes';

interface SidebarItems {
    label: string;
    icon?: string;
    private: boolean;
    clickRoute: string;
}

export default class Sidebar extends Component<T> {

    constructor(props: T) {
        super(props);
        this.props.firebase.auth.onAuthStateChanged((e) => {
            this.forceUpdate();
        });
    }

    icons: SidebarItems[] = [
        {
            label: 'Dashboard',
            icon: logo,
            private: false,
            clickRoute: ROUTES.LANDING
        },
        {
            label: 'Account',
            icon: logo,
            private: true,
            clickRoute: ROUTES.ACCOUNT
        }
    ]

    render() {
        return (
            <FirebaseContext.Consumer>
                {(firebase) => (
                    <div style={SidebarContainerStyle}>
                        {this.icons.map((item) => {
                            if (item.private && !firebase.auth.currentUser) {
                                return null;
                            }

                            return (
                                <div className="logo" key={item.label} title={item.label} onClick={() => {
                                    if (item.clickRoute) {
                                        (this.props).history.push(item.clickRoute);
                                    }
                                }}>
                                    <img src={item.icon} alt={item.label} style={{ marginTop: '20px' }} />
                                </div>
                            )
                        })}
                    </div>
                )}
            </FirebaseContext.Consumer>
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
