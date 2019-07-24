import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink, T } from './signup';
import { withFirebase } from './../../services/firebase/firebase.index';
import { ROUTES } from '../../data/routes';
import { PasswordForgetLink } from './passwordForget';

const SignInPage = () => (
    <div>
        <h1>SignIn</h1>
        <SignInForm />
        <PasswordForgetLink />
        <SignUpLink />
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: { message: null },
};

class SignInFormBase extends Component<T> {
    constructor(props: T) {
        super(props);

        this.state = { ...INITIAL_STATE };

        this.props.firebase.auth.onAuthStateChanged((e) => {
            if (e) {
                // (this.props).history.push(ROUTES.LANDING);
                (this.props as any).history.push(ROUTES.LANDING);
                return;
            }
        });
    }

    state: typeof INITIAL_STATE;

    onSubmit = (event: any) => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                // (this.props).history.push(ROUTES.LANDING);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = (event: any) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <input
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
                <button disabled={isInvalid} type="submit">
                    Sign In
        </button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

// const SignInForm = compose(
//     withRouter,
//     withFirebase,
// )(SignInFormBase);

const SignInForm = withRouter(withFirebase(SignInFormBase));

export default SignInPage;

export { SignInForm };