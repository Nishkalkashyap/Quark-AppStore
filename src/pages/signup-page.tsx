import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { NEW_ROUTES } from '../data/routes';
import { withFirebase } from '../providers/firebase-provider';
import { default as MaterialLink } from '@material-ui/core/Link';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withSnackbar } from 'notistack'
import { basePropType } from '../basePropType';
import { useStyles } from '../components/common-components';
import { Card } from '@material-ui/core';
import { GenericFormData } from '../interfaces';
import GenericFormComponent from '../components/generic-form-component';
import { PasswordForgetLink } from './forgot-password-page';


const SignUpPage = () => <SignUpForm />

const INITIAL_STATE = {
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: { message: null },
};

class SignUpFormBase extends Component<basePropType> {
    constructor(props: basePropType) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    state: typeof INITIAL_STATE;

    onSubmit = (event: any) => {
        const { email, passwordOne } = this.state;

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(NEW_ROUTES.EDIT_PROFILE_PAGE.base);
            })
            .catch(error => {
                this.setState({ error });
                this.props.enqueueSnackbar(error.message, { variant: 'error' });
            });

        event.preventDefault();
    }

    onChange = (event: any) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <SignUpComponent onChange={this.onChange} onSubmit={this.onSubmit} state={this.state}></SignUpComponent>
        );
    }
}

const SignUpComponent = (obj: { onSubmit: any, onChange: any, state: typeof INITIAL_STATE }) => {
    const classes = useStyles();
    const {
        email,
        passwordOne,
        passwordTwo,
    } = obj.state;

    const isInvalid =
        obj.state.passwordOne !== obj.state.passwordTwo ||
        obj.state.passwordOne === '' ||
        obj.state.email === '';

    const data: GenericFormData['data'] = {
        email: {
            formData: {
                label: "Email Address",
                type: "email",
                required: true,
                value: email || '',

                autoComplete: "email"
            }
        },
        passwordOne: {
            formData: {
                label: "Password",
                type: "password",
                required: true,
                value: passwordOne || '',

                autoComplete: "password"
            }
        },
        passwordTwo: {
            formData: {
                label: "Confirm password",
                type: "password",
                required: true,
                value: passwordTwo || '',

                autoComplete: "password"
            }
        }
    }

    return (
        <GenericFormComponent
            headingText="Sign Up"
            icon={LockOutlinedIcon}
            isInvalid={isInvalid}
            onChange={obj.onChange}
            onSubmit={obj.onSubmit}
            submitButtonText="Sign Up"
            data={data}
            postSubmit={(
                <Grid container justify="flex-end">
                    <Grid item>
                        <StupidTypescript variant="body2" to={NEW_ROUTES.SIGN_IN.base} component={Link}>
                            Already have an account? Sign in
                        </StupidTypescript>
                    </Grid>
                </Grid>
            )}
        />
    );
}

const StupidTypescript = MaterialLink as any;
const SignUpLink = () => (
    <StupidTypescript variant="body2" to={NEW_ROUTES.SIGN_UP.base} component={Link}>
        Don't have an account? Sign Up
    </StupidTypescript>
);

const SignUpForm = withRouter(withFirebase(withSnackbar(SignUpFormBase as any)));

export default (SignUpPage);
export { SignUpLink };