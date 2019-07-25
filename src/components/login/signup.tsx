import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { ROUTES } from '../../data/routes';
import { withFirebase } from '../../services/firebase/firebase.index';
import { default as MaterialLink } from '@material-ui/core/Link';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withSnackbar } from 'notistack'
import { basePropType } from '../../basePropType';


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
        // const {
        //     username,
        //     email,
        //     passwordOne,
        //     passwordTwo,
        //     error,
        // } = this.state;

        // const isInvalid =
        //     passwordOne !== passwordTwo ||
        //     passwordOne === '' ||
        //     email === '' ||
        //     username === '';

        // <form onSubmit={this.onSubmit}>
        //     <input
        //         name="username"
        //         value={username}
        //         onChange={this.onChange}
        //         type="text"
        //         placeholder="Full Name"
        //     />
        //     <input
        //         name="email"
        //         value={email}
        //         onChange={this.onChange}
        //         type="text"
        //         placeholder="Email Address"
        //     />
        //     <input
        //         name="passwordOne"
        //         value={passwordOne}
        //         onChange={this.onChange}
        //         type="password"
        //         placeholder="Password"
        //     />
        //     <input
        //         name="passwordTwo"
        //         value={passwordTwo}
        //         onChange={this.onChange}
        //         type="password"
        //         placeholder="Confirm Password"
        //     />
        //     <button disabled={isInvalid} type="submit">Sign Up</button>

        //     {error && <p>{error.message}</p>}
        // </form>
        return (
            <SignUpComponent onChange={this.onChange} onSubmit={this.onSubmit} state={this.state}></SignUpComponent>
        );
    }
}

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));
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
            <CssBaseline />
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