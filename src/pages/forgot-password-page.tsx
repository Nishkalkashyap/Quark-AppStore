import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../providers/firebase-provider';
import { ROUTES } from '../data/routes';
import { SignUpLink } from './signup-page';
import { basePropType } from "../basePropType";
import { default as MaterialLink } from '@material-ui/core/Link';
import { withSnackbar } from 'notistack';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { GenericFormData } from '../interfaces';
import GenericFormComponent from '../components/generic-form-component';

const ForgotPasswordPage = () => <PasswordForgetForm></PasswordForgetForm>

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
                this.props.enqueueSnackbar('A password recovery email has been sent', { variant: 'success' });
            })
            .catch(error => {
                this.setState({ error });
                this.props.enqueueSnackbar(error.message, { variant: 'error' });
            });

        event.preventDefault();
    };

    onChange = (event: any) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <ForgotPasswordElement onChange={this.onChange} onSubmit={this.onSubmit} state={this.state} />
        );
    }
}

const ForgotPasswordElement = (props: { onSubmit: any, onChange: any, state: typeof INITIAL_STATE }) => {
    const { email } = props.state;
    const isInvalid = email === '';

    const data: GenericFormData['data'] = {
        email: {
            formData: {
                label: "Email Address",
                type: "email",
                required: true,
                value: email || '',

                autoComplete: "email"
            }
        }
    }

    return (
        <GenericFormComponent
            headingText="Forgot Password"
            icon={LockOutlinedIcon}
            isInvalid={isInvalid}
            onChange={props.onChange}
            onSubmit={props.onSubmit}
            submitButtonText="Send password reset email"
            data={data}
            postSubmit={<SignUpLink></SignUpLink>}
        />
    );
}


const StupidTypescript = MaterialLink as any;
const PasswordForgetLink = () => (
    <StupidTypescript variant="body2" to={ROUTES.PASSWORD_FORGET_PAGE} component={Link}>
        Forgot Password?
    </StupidTypescript>
);

const PasswordForgetForm = withFirebase(withSnackbar(PasswordForgetFormBase as any));
export default ForgotPasswordPage;


export { PasswordForgetLink };