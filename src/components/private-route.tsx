import React from 'react';
import { Route, Redirect, } from 'react-router-dom';
import { data } from './../data/data.index';

export default function PrivateRoute({ component: Component, ...rest }: any) {
    return (
        <div>
            <Route {...rest} render={(props) => {
                return (
                    data.isAuthenticated === true ?
                        <Component {...props} /> :
                        <Redirect to="/login" />
                )
            }} />
        </div>
    )
}
