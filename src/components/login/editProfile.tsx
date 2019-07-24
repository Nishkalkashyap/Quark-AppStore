import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Firebase, withFirebase } from '../../services/firebase/firebase.index';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { WithSnackbarProps, withSnackbar } from 'notistack'
import withAuthorization from './routeGuard';


const EditProfilePage = () => <EditProfile />

const INITIAL_STATE = {
    name: '',
    bio: '',
    location: '',
    site: ''
};

export interface basePropType { firebase: Firebase, history: { push: (path: string) => void }, enqueueSnackbar: WithSnackbarProps['enqueueSnackbar'] }
class EditProfileBase extends Component<basePropType> {
    constructor(props: basePropType) {
        super(props);
        this.state = { ...INITIAL_STATE };

        const name = this.props.firebase.auth.currentUser!.displayName;
        this.state.name = name || '';
    }

    state: typeof INITIAL_STATE;

    onSubmit = (event: any) => {
        const { name, bio, location, site } = this.state;

        // this.props.firebase.auth.currentUser!.updateProfile()

        // this.props.firebase
        //     .doCreateUserWithEmailAndPassword(email, passwordOne)
        //     .then(authUser => {
        //         this.setState({ ...INITIAL_STATE });
        //         this.props.history.push(ROUTES.LANDING);
        //     })
        //     .catch(error => {
        //         this.setState({ error });
        //         this.props.enqueueSnackbar(error.message, { variant: 'error' });
        //     });

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
        name,
        bio,
        location,
        site
    } = obj.state;

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <AccountBoxIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Edit Profile
                </Typography>
                <form className={classes.form} onSubmit={obj.onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"

                                value={name}
                                onChange={obj.onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="bio"
                                label="Bio"
                                name="bio"

                                multiline
                                rows="4"

                                value={bio}
                                onChange={obj.onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="location"
                                label="Location"
                                name="location"

                                value={location}
                                onChange={obj.onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="site"
                                label="Site"
                                name="site"

                                value={site}
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
                    >
                        Save
                    </Button>
                </form>
            </div>
        </Container>
    )
}

const EditProfile = withRouter(withFirebase(withAuthorization(withSnackbar(EditProfileBase as any))));
export default (EditProfilePage);