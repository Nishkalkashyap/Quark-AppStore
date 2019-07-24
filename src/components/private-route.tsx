import React from 'react';
import { Route, Redirect, } from 'react-router-dom';
// import { data } from './../data/data.index';
import { FirebaseContext } from './../services/firebase/firebase.index'

export default function PrivateRoute({ component: Component, ...rest }: any) {
    return (
        <FirebaseContext.Consumer>
            {
                (firebase) => (
                    <Route {...rest} render={(props) => {
                        return (
                            firebase.auth.currentUser === null ?
                                <Redirect to="/login" /> :
                                <Component {...props} />
                        )
                    }} />
                )
            }
        </FirebaseContext.Consumer>
    )
}
