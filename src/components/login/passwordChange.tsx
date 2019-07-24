import React, { Component } from 'react';
import { withFirebase } from './../../services/firebase/firebase.index';
import { basePropType, SignUpLink } from './signup';
import { Button, TextField, Avatar, makeStyles, Container, CssBaseline, Typography, Grid } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { withSnackbar } from 'notistack';

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: {
        message: null
    },
};

class PasswordChangeForm extends Component<basePropType> {
    constructor(props: basePropType) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    state: typeof INITIAL_STATE;

    onSubmit = (event: any) => {
        const { passwordOne } = this.state;

        this.props.firebase
            .doPasswordUpdate(passwordOne)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
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
        // const { passwordOne, passwordTwo } = this.state;

        // const isInvalid =
        //     passwordOne !== passwordTwo || passwordOne === '';

        // <form onSubmit={this.onSubmit}>
        //     <input
        //         name="passwordOne"
        //         value={passwordOne}
        //         onChange={this.onChange}
        //         type="password"
        //         placeholder="New Password"
        //     />
        //     <input
        //         name="passwordTwo"
        //         value={passwordTwo}
        //         onChange={this.onChange}
        //         type="password"
        //         placeholder="Confirm New Password"
        //     />
        //     <button disabled={isInvalid} type="submit">
        //         Reset My Password
        //     </button>
        // </form>
        return (
            <PasswordChangeElement onChange={this.onChange} onSubmit={this.onSubmit} state={this.state}></PasswordChangeElement>
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

const PasswordChangeElement = (obj: { onSubmit: any, onChange: any, state: typeof INITIAL_STATE }) => {
    const classes = useStyles();
    const { passwordOne, passwordTwo } = obj.state;
    const isInvalid = passwordOne != passwordTwo;

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Change Password
                </Typography>
                <form className={classes.form} onSubmit={obj.onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="password"
                                name="passwordOne"
                                variant="outlined"
                                required
                                fullWidth
                                id="password1"
                                label="New Password"
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

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={isInvalid}
                        >
                            Change Password
                        </Button>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}

export default withFirebase(withSnackbar(PasswordChangeForm as any));