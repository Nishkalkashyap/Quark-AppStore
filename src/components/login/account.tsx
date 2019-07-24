import React from 'react';

import { PasswordForgetForm } from './passwordForget';
import PasswordChangeForm from './passwordChange';
import { withFirebase } from '../../services/firebase/firebase.index';
import withAuthorization from './routeGuard';

const AccountPage = () => (
    <div>
        <h1>Account Page</h1>

        <h2>Reset Password</h2>
        <PasswordForgetForm />
        <PasswordChangeForm />
    </div>
);

export default withAuthorization(withFirebase(AccountPage));