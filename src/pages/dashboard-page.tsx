import React from 'react';

import { withAuthorization } from '../providers/route-guard-provider';
import { withFirebase } from '../providers/firebase-provider';
import { withAllProviders } from '../providers/all-providers';

const Dashboard = () => (
    <div>
        <h1>Dashboard Page</h1>
        <p>This Page is accessible by every signed in user.</p>
    </div>
);

export default withAllProviders(Dashboard);