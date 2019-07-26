import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink } from './signup-page';
import { basePropType } from "../basePropType";
import { withFirebase } from '../services/firebase/firebase.index';
import { ROUTES } from '../data/routes';
import { PasswordForgetLink } from './forgot-password-page';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withSnackbar } from 'notistack';
import { useStyles } from '../components/common';

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
                (this.props).history.push(ROUTES.DASHBOARD);
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
    const classes = useStyles();
    const { email, password } = obj.state;
    const isInvalid = password === '' || email === '' || password.length < 8;

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
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
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth

                        id="password"
                        label="Password"
                        name="password"
                        autoComplete="current-password"
                        type="password"

                        value={password}
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
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <PasswordForgetLink></PasswordForgetLink>
                        </Grid>
                        <Grid item>
                            <SignUpLink></SignUpLink>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
};

const SignInForm = withRouter(withFirebase(withSnackbar(SignInFormBase as any)));

export default SignInPage;