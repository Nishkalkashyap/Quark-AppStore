import React from 'react';

import { PasswordForgetForm } from './passwordForget';
import PasswordChangeForm from './passwordChange';
import { withFirebase } from '../../services/firebase/firebase.index';
import withAuthorization from './routeGuard';
import SignOutButton from './signout';

const AccountPage = () => (
    <div>
        <h1>Account</h1>

        <h2>Change Password</h2>
        <PasswordChangeForm />
        <SignOutButton></SignOutButton>
    </div>
);

export default withAuthorization(withFirebase(AccountPage));