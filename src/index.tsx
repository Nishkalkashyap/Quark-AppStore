import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Firebase, FirebaseContext } from './providers/firebase-provider';
import { SnackbarProvider } from 'notistack';
import 'typeface-roboto';

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <SnackbarProvider maxSnack={5}>
            <App />
        </SnackbarProvider>
    </FirebaseContext.Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
