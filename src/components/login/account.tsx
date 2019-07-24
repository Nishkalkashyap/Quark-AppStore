import React from 'react';

import { PasswordForgetForm } from './passwordForget';
import PasswordChangeForm from './passwordChange';

const AccountPage = () => (
    <div>
        <h1>Account Page</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
    </div>
);

export default AccountPage;