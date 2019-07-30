import React, { Component } from 'react'
import { basePropType } from '../basePropType';
import { MATCH_PARAMS, ROUTES } from '../data/routes';
import { ProjectData } from '../interfaces';
import { cloneDeep } from 'lodash';
import { getProjectStatsDocPath, getProjectDocPath } from '../data/paths';
import { handleFirebaseError } from '../util';
import { withAllProviders } from '../providers/all-providers';
import { withOriginalOwner } from '../providers/owner-guard';
import { Container, Card, Typography, TextField, Button, Grid } from '@material-ui/core';
import { PasswordForgetLink } from './forgot-password-page';
import { SignUpLink } from './signup-page';
import { globalStyles } from '../components/common-components';
import { withStyles } from '@material-ui/styles';

interface StateType {
    userId: string,
    projectId: string,
    projectData: Partial<ProjectData>,
    isOwner: boolean,
    numberOfDownloads: number
}

class LocalComponent extends Component<basePropType> {

    INITIAL_STATE: StateType = {
        userId: '',
        projectId: '',
        projectData: {},
        isOwner: false,
        numberOfDownloads: 0
    }

    constructor(props: basePropType) {
        super(props);
        this._setInitialState();
        this._setProjectData();
    }

    private _setInitialState() {
        const userId = this.props.match.params[MATCH_PARAMS.USER_ID] || this.props.firebase.auth.currentUser!.uid;
        const projectId = this.props.match.params[MATCH_PARAMS.PROJECT_ID];

        this.state = cloneDeep(this.INITIAL_STATE);
        this.state.userId = userId;
        this.state.projectId = projectId;

        this.props.firebase.firestore.doc(getProjectStatsDocPath(userId, projectId)).get()
            .then((snap) => {
                const data = (snap.data() || { numberOfDownloads: 0 });
                this.setState({ numberOfDownloads: data.numberOfDownloads });
            })
            .catch((err) => handleFirebaseError(this.props, err, 'Cannot fetch downloads'))

        this.props.firebase.auth.onAuthStateChanged((e) => {
            if (e) {
                this.setState({ isOwner: e.uid == userId });
            }
        });
    }

    state: StateType = {} as any;

    private _setProjectData() {
        this.props.firebase.firestore.doc(getProjectDocPath(this.state.userId, this.state.projectId))
            .get()
            .then((snap) => {
                if (!snap.exists) {
                    this.props.history.push(ROUTES.NOT_FOUND);
                    return;
                }
                this.setState({ projectData: snap.data() });
            })
            .catch((err) => handleFirebaseError(err, this.props, 'Could not fetch project data'));
    }

    onSubmit = (event: any) => {
        event.preventDefault();
        console.log(event);
    };

    onChange = (event: any) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const classes = this.props.classes!;
        return (
            <div>
                <Container component="section" maxWidth="md">
                    <Card style={{ padding: '10px 40px' }}>
                        <div className={classes.paper}>
                            <Typography component="h1" variant="h3">
                                Edit Project
                            </Typography>
                            <form className={classes.form}>
                                {/* <form className={classes.form} onSubmit={obj.onSubmit}> */}
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

                                // value={email}
                                // onChange={obj.onChange}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                // disabled={isInvalid}
                                >
                                    Update
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
                    </Card>
                </Container>
            </div>
        )
    }
}



const EditProjectPage = withStyles(globalStyles as any)(withAllProviders(withOriginalOwner(LocalComponent)));
export { EditProjectPage };
