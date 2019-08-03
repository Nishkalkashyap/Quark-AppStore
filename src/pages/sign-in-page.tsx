import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink } from './signup-page';
import { basePropType } from "../basePropType";
import { withFirebase } from '../providers/firebase-provider';
import { ROUTES } from '../data/routes';
import { PasswordForgetLink } from './forgot-password-page';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withSnackbar } from 'notistack';
import { useStyles } from '../components/common-components';
import { Card } from '@material-ui/core';
import { GenericFormData } from '../interfaces';
import GenericFormComponent from '../components/generic-form-component';

const SignInPage = () => <SignInForm />;

const INITIAL_STATE = {
    email: '',
    password: '',
    error: { message: null },
};

class SignInFormBase extends Component<basePropType> {
    constructor(props: basePropType) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.props.firebase.auth.onAuthStateChanged((e) => {
            if (e) {
                (this.props).history.push(ROUTES.DASHBOARD_PAGE);
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
                this.props.enqueueSnackbar('Signing in', { variant: 'success' });
                // (this.props).history.push(ROUTES.LANDING);
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
            <MaterialComponent onChange={this.onChange} onSubmit={this.onSubmit} state={this.state}></MaterialComponent>
        )
    }
}

const MaterialComponent = (obj: { onSubmit: any, onChange: any, state: typeof INITIAL_STATE }) => {
    const { email, password } = obj.state;
    const isInvalid = password === '' || email === '' || password.length < 8;

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
        password: {
            formData: {
                label: "Password",
                type: "password",
                required: true,
                value: password || '',

                autoComplete: "password"
            }
        }
    }

    return (
        <GenericFormComponent
            headingText="Sign in"
            icon={LockOutlinedIcon}
            isInvalid={isInvalid}
            onChange={obj.onChange}
            onSubmit={obj.onSubmit}
            submitButtonText="Sign In"
            data={data}
            postSubmit={(
                <Grid container>
                    <Grid item xs>
                        <PasswordForgetLink></PasswordForgetLink>
                    </Grid>
                    <Grid item>
                        <SignUpLink></SignUpLink>
                    </Grid>
                </Grid>
            )}
        />
    );
};

const SignInForm = withRouter(withFirebase(withSnackbar(SignInFormBase as any)));

export default SignInPage;