import React from 'react';
import './index.scss';
import {FirebaseContext} from './../../services/firebase/firebase.index'

export default function LoginOrRegister() {
    return (
        <FirebaseContext.Consumer>
            {
                (firebase)=>(
                    <div>
                    </div>
                )
            }
        </FirebaseContext.Consumer>
    )
}

function Login() {
    return (
        <div>

        </div>
    )
}

