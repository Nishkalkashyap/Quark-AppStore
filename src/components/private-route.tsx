import React from 'react';
import { Route, Redirect, } from 'react-router-dom';
import { FirebaseContext } from './../services/firebase/firebase.index';
import { ROUTES } from './../data/routes';

export default function PrivateRoute({ component: Component, ...rest }: any) {
    return (
        <FirebaseContext.Consumer>
            {
                (firebase) => (
                    <Route {...rest} render={(props) => {
                        return (
                            firebase.auth.currentUser === null ?
                                <Redirect to={ROUTES.SIGN_IN} /> :
                                <Component {...props} />
                        )
                    }} />
                )
            }
        </FirebaseContext.Consumer>
    )
}
