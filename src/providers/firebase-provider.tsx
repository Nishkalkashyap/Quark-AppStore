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
        email: string;
        message: string;
    },
    abuseReport: {
        email: string;
        subject: string;
        type: string;
        description: string;

        userId: string;
        projectId: string;
    }
}>

interface DocListenerInterface {
    ref: firebase.firestore.DocumentReference;
    snap: app.firestore.DocumentSnapshot | null;
    listeners: ((snap: firebase.firestore.DocumentSnapshot) => void)[]
    _mainListener: () => void;
}

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

    private _documentListeners: DocListenerInterface[] = [];
    getListenerForDocument(ref: firebase.firestore.DocumentReference, onNext: (snapshot: firebase.firestore.DocumentSnapshot) => void) {

        const existingListener = this._documentListeners.find((val) => { return val.ref.path == ref.path; });
        if (existingListener) {
            console.log('Using Existing listener', this._documentListeners.length);
            existingListener.listeners.push(onNext);
            if (existingListener.snap) {
                onNext(existingListener.snap as any);
            }
            return removeListener(existingListener);
        }

        console.log('Created listeter');
        const newListener: DocListenerInterface = {
            ref,
            listeners: [onNext],
            snap: null,
            _mainListener: ref.onSnapshot((snap) => {
                newListener.snap = snap;
                newListener.listeners.map((list) => {
                    list(snap);
                });
            }, (err) => console.log(err))
        };

        this._documentListeners.push(newListener);

        return removeListener(newListener);

        function removeListener(docListener: DocListenerInterface): () => void {
            return () => {
                const findIndex = docListener.listeners.findIndex((val) => val == onNext);
                if (findIndex !== -1) {
                    const l = docListener.listeners.splice(findIndex, 1);
                }
            }
        }
    }

}

export const FirebaseContext = React.createContext<Firebase>(null as any);

export const withFirebase = (Component: any) => (props: any) => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
);