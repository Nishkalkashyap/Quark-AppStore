import React from 'react';
import { withFirebase } from '../../services/firebase/firebase.index';
import withAuthorization from './routeGuard';
import SignOutButton from './signout';
import { basePropType } from './signup';
import logo from './../../assets/logo.svg';
import { StandardProperties } from 'csstype';

const AccountPage = (props: basePropType) => {
    const user = props.firebase.auth.currentUser as firebase.User;
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            <div style={SubContainer}>
                <div className="left-content">
                    <img src={user.photoURL || logo} alt="user image" style={ImageStyle} />
                </div>
                <div className="right-content">

                </div>
            </div>
        </div>
    )
};

const SubContainer: StandardProperties = {
    maxWidth: '800px'
}

const ImageStyle: StandardProperties = {
    maxWidth: '200px',
    borderRadius : '5px'
}

export default withAuthorization(withFirebase(AccountPage));