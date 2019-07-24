import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from './../../services/firebase/firebase.index';
import { ROUTES } from '../../data/routes';
import { basePropType } from './signup';
import { default as MaterialLink } from '@material-ui/core/Link';

const PasswordForgetPage = () => (
    <div>
        <h1>PasswordForget</h1>
        <PasswordForgetForm />
    </div>
);

const INITIAL_STATE = {
    email: '',
    error: {
        message: null
    },
};

class PasswordForgetFormBase extends Component<basePropType> {
    constructor(props: basePropType) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    state: typeof INITIAL_STATE;

    onSubmit = (event: any) => {
        const { email } = this.state;

        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
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
        const { email, error } = this.state;

        const isInvalid = email === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <button disabled={isInvalid} type="submit">
                    Reset My Password
        </button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const Tabbb = MaterialLink as any;
const PasswordForgetLink = () => (
    // <p>
    //     <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
    // </p>
    <Tabbb variant="body2" to={ROUTES.PASSWORD_FORGET} component={Link}>
        Forgot Password?
    </Tabbb>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };