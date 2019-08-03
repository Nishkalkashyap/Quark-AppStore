import React, { Component } from 'react'
import { basePropType } from "../basePropType";
import { Container, Avatar, Typography, TextField, Button, Card, FormControl, InputLabel, Select, OutlinedInput, MenuItem } from '@material-ui/core';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import { getDocument_project } from '../data/paths';
import { handleFirebaseError, getRandomId, allProjectCategories } from '../util';
import firebase from 'firebase';
import { ROUTES } from '../data/routes';
import { useStyles } from '../components/common-components';
import { withAllProviders } from '../providers/all-providers';
import { ProjectData, allCategories, GenericFormData } from '../interfaces';
import GenericFormComponent from '../components/generic-form-component';

const INITIAL_STATE = {
    projectName: '',
    description: '',
    projectId: '',
    createdAt: '',
    tagline: '',
    category: 'Productivity' as allCategories
}

class LocalComponent extends Component<basePropType, typeof INITIAL_STATE> {

    constructor(props: basePropType) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    state: typeof INITIAL_STATE;

    onSubmit = (event: any) => {
        event.preventDefault();
        const random = getRandomId();
        const createdAt = firebase.firestore.FieldValue.serverTimestamp();

        const dataToSend: ProjectData = {
            numberOfReleases: 0,
            projectId: random,
            userId: this.props.firebase.auth.currentUser!.uid,
            updatedAt: createdAt as any,
            createdAt: createdAt as any,
            description: this.state.description,
            projectName: this.state.projectName,
            tagline: this.state.tagline,
            category: this.state.category
        }

        this.props.firebase.firestore.doc(getDocument_project(this.props.firebase.auth.currentUser!.uid, random)).set(dataToSend).then(() => {
            // this.props.firebase.firestore.doc(getProjectDocPath(this.props.firebase.auth.currentUser!.uid, random)).set({ ...this.state, createdAt, updatedAt: createdAt, projectId: random, numberOfReleases: 0, numberOfDownloads : 0 }).then(() => {
            this.props.enqueueSnackbar('Project created', { variant: 'success' });
            this.props.history.push(`${ROUTES.PROJECT_PAGE}/${this.props.firebase.auth.currentUser!.uid}/${random}`);
        })
            .catch((err) => {
                handleFirebaseError(this.props, err, 'Failed to create project');
            })
    };

    onChange = (event: any) => {
        this.setState({ [event.target.name]: event.target.value } as any);
    };

    render() {
        return (
            <MaterialComponent onSubmit={this.onSubmit} onChange={this.onChange} state={this.state} ></MaterialComponent>
        )
    }
}

const MaterialComponent = (props: { onSubmit: any, onChange: any, state: typeof INITIAL_STATE }) => {
    const classes = useStyles();
    const { projectName, description, tagline, category } = props.state;
    const isInvalid = projectName === '' || description === '' || tagline === '';

    const data: GenericFormData['data'] = {
        projectName: {
            formData: {
                label: "Project Name",
                type: "text",
                required: true,
                value: projectName || ''
            }
        },
        tagline: {
            formData: {
                label: "Tag line",
                type: "text",
                required: true,
                value: tagline || ''
            }
        },
        description: {
            formData: {
                label: "Description",
                type: "text",
                required: true,
                value: description || '',

                multiline: true,
                rows: "4"
            }
        },
        category: {
            component: (
                <FormControl variant="outlined" margin="normal" className={classes.formControl}>
                    <InputLabel>
                        Category
                            </InputLabel>
                    <Select
                        value={category || ''}
                        onChange={props.onChange}
                        input={<OutlinedInput labelWidth={10} name="category" />}
                    >
                        {
                            allProjectCategories.map((cat) => (
                                <MenuItem value={cat} key={cat}>{cat}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            )
        }
    }

    return (
        <GenericFormComponent
            headingText="Create Project"
            icon={FiberNewIcon}
            isInvalid={isInvalid}
            onChange={props.onChange}
            onSubmit={props.onSubmit}
            submitButtonText="Create"
            data={data}
        />
    );

};

export const CreateNewProjectPage = withAllProviders(LocalComponent);