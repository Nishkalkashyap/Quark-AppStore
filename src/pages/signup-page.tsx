import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { ROUTES } from '../data/routes';
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
                this.props.history.push(ROUTES.LANDING);
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

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} onSubmit={obj.onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="email"
                                name="email"
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"

                                value={email}
                                onChange={obj.onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="password"
                                name="passwordOne"
                                variant="outlined"
                                required
                                fullWidth
                                id="password1"
                                label="Password"
                                type="password"

                                value={passwordOne}
                                onChange={obj.onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="password"
                                name="passwordTwo"
                                variant="outlined"
                                required
                                fullWidth
                                id="password2"
                                label="Confirm Password"
                                type="password"

                                value={passwordTwo}
                                onChange={obj.onChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isInvalid}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <StupidTypescript variant="body2" to={ROUTES.SIGN_IN} component={Link}>
                                Already have an account? Sign in
                            </StupidTypescript>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}

const StupidTypescript = MaterialLink as any;
const SignUpLink = () => (
    <StupidTypescript variant="body2" to={ROUTES.SIGN_UP} component={Link}>
        Don't have an account? Sign Up
    </StupidTypescript>
);

const SignUpForm = withRouter(withFirebase(withSnackbar(SignUpFormBase as any)));

export default (SignUpPage);
export { SignUpLink };