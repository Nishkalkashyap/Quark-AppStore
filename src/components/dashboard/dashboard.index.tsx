import React from 'react';

import { withAuthorization } from './../login/routeGuard';
import { withFirebase } from '../../services/firebase/firebase.index';

const Dashboard = () => (
    <div>
        <h1>Dashboard Page</h1>
        <p>The Home Page is accessible by every signed in user.</p>
    </div>
);

export default withAuthorization(withFirebase(Dashboard));