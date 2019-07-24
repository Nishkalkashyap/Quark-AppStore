import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from './../../services/firebase/firebase.index';
import { ROUTES } from '../../data/routes';
import { basePropType, SignUpLink } from './signup';
import { default as MaterialLink } from '@material-ui/core/Link';
import { TextField, Button, makeStyles, Container, CssBaseline, Avatar, Typography } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const PasswordForgetPage = () => <PasswordForgetForm></PasswordForgetForm>

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
        // const { email, error } = this.state;

        // const isInvalid = email === '';

        // <form onSubmit={this.onSubmit}>
        //     <input
        //         name="email"
        //         value={this.state.email}
        //         onChange={this.onChange}
        //         type="text"
        //         placeholder="Email Address"
        //     />
        //     <button disabled={isInvalid} type="submit">
        //         Reset My Password
        //     </button>

        //     {error && <p>{error.message}</p>}
        // </form>
        return (
            <ForgotPasswordElement onChange={this.onChange} onSubmit={this.onSubmit} state={this.state} />
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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

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

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(withSnackbar(PasswordForgetFormBase as any));

export { PasswordForgetForm, PasswordForgetLink };