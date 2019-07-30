import React, { Component } from 'react'
import { basePropType } from '../basePropType';
import { MATCH_PARAMS, ROUTES } from '../data/routes';
import { ProjectData } from '../interfaces';
import { cloneDeep } from 'lodash';
import { getProjectStatsDocPath, getProjectDocPath } from '../data/paths';
import { handleFirebaseError } from '../util';
import { withAllProviders } from '../providers/all-providers';
import { withOriginalOwner } from '../providers/owner-guard';
import { Container, Card, Typography, TextField, Button, Grid, Zoom, Paper } from '@material-ui/core';
import { PasswordForgetLink } from './forgot-password-page';
import { SignUpLink } from './signup-page';
import { globalStyles } from '../components/common-components';
import { withStyles } from '@material-ui/styles';

interface StateType {
    userId: string,
    projectId: string,
    projectData: Partial<ProjectData>,
    isOwner: boolean
    images: string[]
}

class LocalComponent extends Component<basePropType> {

    INITIAL_STATE: StateType = {
        userId: '',
        projectId: '',
        projectData: {},
        isOwner: false,
        images: ['', '', '']
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
        // console.log({[event.target.name]: event.target.value});
        this.setState({ projectData: { [event.target.name]: event.target.value } });
    };

    render() {
        const classes = this.props.classes!;
        const { projectData, images } = this.state;
        const { createdAt, description, projectName, updatedAt, projectId } = projectData!;
        const isInvalid = projectName == '' || description == '';

        return (
            <div>
                <Container component="section" maxWidth="md">
                    <Card style={{ padding: '10px 40px' }}>
                        <div className={classes.paper}>
                            <Typography component="h1" variant="h3">
                                Edit Project
                            </Typography>
                            <form className={classes.form} onSubmit={this.onSubmit}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth

                                    label="Name"
                                    name="projectName"
                                    type="text"
                                    autoFocus

                                    value={projectName || ''}
                                    onChange={this.onChange}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth

                                    label="Description"
                                    name="description"
                                    type="text"
                                    autoFocus

                                    value={description || ''}
                                    onChange={this.onChange}
                                />
                                <div style={{ display: 'flex', maxWidth: '100%', overflowX: 'auto' }}>
                                    {
                                        images.map((img, index) => (
                                            <Zoom in={true} style={{ margin: '0px 10px', transitionDelay: index ? 500 * index + 'ms' : '0ms' }}>
                                                <Paper elevation={4} className={classes.paper}>
                                                    <img src="https://via.placeholder.com/150" alt="" />
                                                </Paper>
                                            </Zoom>
                                        ))
                                    }
                                </div>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    disabled={isInvalid}
                                >
                                    Update
                                </Button>
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
