import React from 'react';
import * as app from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/functions';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_ID
};

type DashboardData = Partial<{
    feedback: {
        message: string;
    },
    reportAbuse: {
        message: string;
    }
}>

export class Firebase {

    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.storage = app.storage();
        this.firestore = app.firestore();
        this.functions = app.functions();


        this.firestore.enablePersistence({
            synchronizeTabs: true
        })
            .catch(function (err) {
                if (err.code == 'failed-precondition') {
                    console.log(err);
                    // Multiple tabs open, persistence can only be enabled
                    // in one tab at a a time.
                    // ...
                } else if (err.code == 'unimplemented') {
                    console.log(err);
                    // The current browser does not support all of the
                    // features required to enable persistence
                    // ...
                }
            });

    }

    auth: app.auth.Auth;
    storage: app.storage.Storage;
    firestore: app.firestore.Firestore;
    private functions: app.functions.Functions;

    callFeedbackFunction(msg: DashboardData) {
        return this.functions.httpsCallable('DashboardFunction')(msg);
    }

    doCreateUserWithEmailAndPassword = (email: string, password: string) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email: string, password: string) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = (password: string): Promise<void> => {
        if (this.auth.currentUser) {
            return this.auth.currentUser.updatePassword(password);
        }
        return Promise.resolve();
    }
}

export const FirebaseContext = React.createContext<Firebase>(null as any);

export const withFirebase = (Component: any) => (props: any) => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
);