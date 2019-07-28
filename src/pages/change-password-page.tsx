import React, { Component } from 'react';
import { basePropType } from "../basePropType";
import { Button, TextField, Avatar, Container, Typography, Grid } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { ROUTES } from '../data/routes';
import { useStyles } from '../components/common-components';
import { withAllProviders } from '../providers/all-providers';

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
                this.props.enqueueSnackbar('Password changed', { variant: 'success' });
                this.props.history.push(ROUTES.ACCOUNT_PAGE);
            })
            .catch(error => {
                this.setState({ error });
                this.props.enqueueSnackbar(error.message, { variant: 'error' });
            })

        event.preventDefault();
    };

    onChange = (event: any) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <PasswordChangeElement onChange={this.onChange} onSubmit={this.onSubmit} state={this.state}></PasswordChangeElement>
        );
    }
}

const PasswordChangeElement = (obj: { onSubmit: any, onChange: any, state: typeof INITIAL_STATE }) => {
    const classes = useStyles();
    const { passwordOne, passwordTwo } = obj.state;
    const isInvalid = passwordOne !== passwordTwo;

    return (
        <Container component="section" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h3">
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

export default withAllProviders(PasswordChangeForm);