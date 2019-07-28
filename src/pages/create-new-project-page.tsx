import React, { Component } from 'react'
import { basePropType } from "../basePropType";
import { Container, Avatar, Typography, TextField, Button } from '@material-ui/core';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import { getProjectPath } from '../data/paths';
import { handleFirebaseError, getRandomId } from '../util';
import firebase from 'firebase';
import { ROUTES } from '../data/routes';
import { useStyles } from '../components/common-components';
import { withAllProviders } from '../providers/all-providers';

const INITIAL_STATE = {
    projectName: '',
    description: '',
    projectId: '',
    createdAt: ''
}

class LocalComponent extends Component<basePropType> {

    constructor(props: basePropType) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    state: typeof INITIAL_STATE;

    onSubmit = (event: any) => {
        event.preventDefault();
        const random = getRandomId();
        const createdAt = firebase.firestore.FieldValue.serverTimestamp();
        this.props.firebase.firestore.doc(getProjectPath(this.props.firebase.auth.currentUser!.uid, random)).set({ ...this.state, createdAt, updatedAt: createdAt, projectId: random, numberOfReleases: 0 }).then(() => {
            this.props.enqueueSnackbar('Project created', { variant: 'success' });
            this.props.history.push(`${ROUTES.PROJECT_PAGE}/${this.props.firebase.auth.currentUser!.uid}/${random}`);
        })
            .catch((err) => {
                handleFirebaseError(this.props, err, 'Failed to create project');
            })
    };

    onChange = (event: any) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <MaterialComponent onSubmit={this.onSubmit} onChange={this.onChange} state={this.state} ></MaterialComponent>
        )
    }
}

const MaterialComponent = (obj: { onSubmit: any, onChange: any, state: typeof INITIAL_STATE }) => {
    const classes = useStyles();
    const { projectName, description } = obj.state;
    const isInvalid = projectName === '' || description === '';

    return (
        <Container component="section" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <FiberNewIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    New Project
                </Typography>
                <form className={classes.form} onSubmit={obj.onSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth

                        id="projectName"
                        label="Project Name"
                        name="projectName"
                        type="text"
                        autoFocus

                        value={projectName}
                        onChange={obj.onChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth

                        id="description"
                        label="Description"
                        name="description"
                        type="text"

                        value={description}
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
                        Create
                    </Button>
                </form>
            </div>
        </Container>
    )
};

export const CreateNewProjectPage = withAllProviders(LocalComponent);