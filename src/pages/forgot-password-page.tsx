import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../services/firebase/firebase.index';
import { ROUTES } from '../data/routes';
import { SignUpLink } from './signup-page';
import { basePropType } from "../basePropType";
import { default as MaterialLink } from '@material-ui/core/Link';
import { TextField, Button, makeStyles, Container, CssBaseline, Avatar, Typography } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useStyles } from '../components/common';

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

const ForgotPasswordElement = (obj: { onSubmit: any, onChange: any, state: typeof INITIAL_STATE }) => {
    const classes = useStyles();
    const { email } = obj.state;
    const isInvalid = email === '';

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Forgot Password
                </Typography>
                <form className={classes.form} onSubmit={obj.onSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth

                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        type="email"
                        autoFocus

                        value={email}
                        onChange={obj.onChange}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isInvalid}
                    >
                        Send password reset email
                    </Button>
                    <SignUpLink></SignUpLink>
                </form>
            </div>
        </Container>
    )
}


const StupidTypescript = MaterialLink as any;
const PasswordForgetLink = () => (
    <StupidTypescript variant="body2" to={ROUTES.PASSWORD_FORGET} component={Link}>
        Forgot Password?
    </StupidTypescript>
);

const PasswordForgetForm = withFirebase(withSnackbar(PasswordForgetFormBase as any));
export default ForgotPasswordPage;


export { PasswordForgetLink };