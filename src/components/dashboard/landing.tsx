import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../data/routes';

const Landing = () => (
    <div>
        <h1>Landing Page</h1>
        <p>This Page is accessible by everyone.</p>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </div>
);

export default (Landing);