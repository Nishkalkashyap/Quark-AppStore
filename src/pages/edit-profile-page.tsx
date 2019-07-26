import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../providers/firebase-provider';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withSnackbar } from 'notistack'
import withAuthorization from '../providers/route-guard-provider';
import { getProfilePath } from '../data/paths';
import { basePropType } from '../basePropType';
import { useStyles } from '../components/common-components';


const EditProfilePage = () => <EditProfile />

const INITIAL_STATE = {
    name: '',
    bio: '',
    location: '',
    site: ''
};

class EditProfileBase extends Component<basePropType> {
    constructor(props: basePropType) {
        super(props);
        this.state = { ...INITIAL_STATE };

        const name = this.props.firebase.auth.currentUser!.displayName;
        this.state.name = name || '';
    }

    componentDidMount() {
        const currentUser = this.props.firebase.auth.currentUser!;
        this.props.firebase.firestore.doc(getProfilePath(currentUser)).get()
            .then((val) => {
                const data = (val.data() || {}) as any;
                Object.keys(data).map((key) => {
                    this.setState({ [key]: data[key] })
                });
            }).catch((err) => {
                console.error(err);
                this.props.enqueueSnackbar('Failed to fetch profile', { variant: 'error' });
            });
    }

    state: typeof INITIAL_STATE;

    onSubmit = (event: any) => {
        const { name, bio, location, site } = this.state;

        const currentUser = this.props.firebase.auth.currentUser!;
        const promises = [
            currentUser.updateProfile({
                displayName: name
            }),
            this.props.firebase.firestore.doc(getProfilePath(currentUser)).set({
                name, bio, location, site
            })
        ];

        Promise.all(promises).then((val) => {
            this.props.enqueueSnackbar('Updated profile', { variant: 'success' });
        }).catch((err) => {
            console.error(err);
            this.props.enqueueSnackbar('Failed to update profile', { variant: 'error' });
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