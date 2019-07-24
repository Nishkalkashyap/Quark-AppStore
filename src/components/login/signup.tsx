import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../data/routes';
import { FirebaseContext } from '../../services/firebase/firebase.index';

const SignUpPage = () => (
    <div>
        <h1>SignUp</h1>
        <FirebaseContext.Consumer>
            {(firebase) => (<SignUpForm firebase={firebase} />)}
        </FirebaseContext.Consumer>
    </div>
);


const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: { message: null },
};


class SignUpForm extends Component {
    constructor(props: any) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    state: typeof INITIAL_STATE;

    onSubmit = (event: any) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    onChange = (event: any) => {

    };

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="username"
                    value={username}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Full Name"
                />
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Confirm Password"
                />
                <button disabled={isInvalid} type="submit">Sign Up</button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

export default SignUpPage;

export { SignUpForm, SignUpLink };