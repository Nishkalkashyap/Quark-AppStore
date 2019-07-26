import React from 'react';

import { withAuthorization } from '../components/providers/route-guard-provider';
import { withFirebase } from '../components/providers/firebase-provider';

const Dashboard = () => (
    <div>
        <h1>Dashboard Page</h1>
        <p>This Page is accessible by every signed in user.</p>
    </div>
);

export default withAuthorization(withFirebase(Dashboard));