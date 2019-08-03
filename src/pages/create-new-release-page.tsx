import React, { useState } from 'react'
import { basePropType } from "../basePropType";
import { Container, Avatar, Typography, TextField, Button, Card } from '@material-ui/core';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import { useForceUpdate, getRandomId, handleFirebaseError } from '../util';
import { MATCH_PARAMS, ROUTES } from '../data/routes';
import firebase from 'firebase';
import { getDocument_release } from '../data/paths';
import { ReleaseItem, GenericFormData } from '../interfaces';
import { useStyles } from '../components/common-components';
import { withAllProviders } from '../providers/all-providers';
import { withOriginalOwner } from '../providers/owner-guard';
import { DropZoneComponent } from '../components/drop-zone';
import GenericFormComponent from '../components/generic-form-component';

type FilesToUpload = { [key: string]: { buffer: ArrayBuffer, file: File, percent: number } };

const FILE_UPLOAD_LIMIT = 20000000;

const LocalComponent = (props: basePropType) => {

    const filesToUploa: FilesToUpload = {};
    const INITIAL_STATE = {
        notes: '',
        filesToUpload: filesToUploa,
        uploadSize: 0
    }

    const [state, setState] = useState(INITIAL_STATE);

    const classes = useStyles();
    const onSubmit = (event: any) => {
        event.preventDefault();

        const releaseId = getRandomId();
        const createdAt = firebase.firestore.FieldValue.serverTimestamp();
        const userId = props.match.params[MATCH_PARAMS.USER_ID];
        const projectId = props.match.params[MATCH_PARAMS.PROJECT_ID];

        const releaseData: ReleaseItem = {
            updatedAt: createdAt as any,
            createdAt: createdAt as any,
            releaseId,
            projectId,
            notes: state.notes,
            assets: Object.keys(state.filesToUpload)
        }

        props.firebase.firestore.doc(getDocument_release(userId, projectId, releaseId)).set(releaseData)
            .then(() => {
                props.enqueueSnackbar('Release created', { variant: 'success' });
                props.enqueueSnackbar('Uploading files. Please wait.', { variant: 'info' });

                uploadFilesToBucket()
                    .then(() => {
                        props.enqueueSnackbar('Files uploaded', { variant: 'success' });
                    })
                    .catch((err) => handleFirebaseError(props, err, 'Failed to upload files'))
                    .finally(() => {
                        props.history.push(`${ROUTES.PROJECT_PAGE}/${userId}/${projectId}`);
                    })
            })
            .catch((err) => {
                handleFirebaseError(props, err, 'Failed to create project');
            })

        async function uploadFilesToBucket() {
            const releaseBucketFolder = getDocument_release(userId, projectId, releaseId);
            const bucketUploadPromises = Object.keys(state.filesToUpload).map((key) => {
                const file = state.filesToUpload[key];
                const ref = props.firebase.storage.ref(`${releaseBucketFolder}/${file.file.name}`);
                const task = ref.put(file.buffer);
                task.on('state_changed', (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    file.percent = progress;
                    setState({ filesToUpload: state.filesToUpload } as any);
                });
                return task;
            });
            return await Promise.all(bucketUploadPromises);
        }
    }

    const forceUpdate = useForceUpdate();

    const onChange = (event: any) => {
        setState({ ...state, notes: event.target.value });
    }

    const addFiles = (ftu: FilesToUpload, size: number) => {
        const finalObject: typeof INITIAL_STATE = (state);
        state.filesToUpload = ftu;
        finalObject.uploadSize = size;
        setState({ ...finalObject });
    }

    function isDisabled() {
        const keys = Object.keys(state.filesToUpload);

        if (keys.length === 0) return true;
        if (state.uploadSize > 20000000) return true;
        if (state.notes === '') return true;

        const buildFileExists = !!keys.find((key) => key.match(/\.build\.(qrk)$/));
        const projectFileExists = !!keys.find((key) => key.match(/\.(qrk)$/) && key.search('.build.qrk') === -1);

        if (!buildFileExists || !projectFileExists) return true;
        return false;
    }

    const { notes } = state;
    const data: GenericFormData['data'] = {
        notes: {
            formData: {
                label: "Notes",
                type: "text",
                required: true,
                value: notes || '',

                multiline: true,
                rows: "4"
            }
        },
        dropzone: {
            component: (
                <DropZoneComponent
                    addFiles={addFiles}
                    allowedExtensions={['qrk', 'ino', 'package.json']}
                    uploadLimit={FILE_UPLOAD_LIMIT}
                    forceUpdate={forceUpdate}
                    props={props}
                />
            )
        }
    }

    return (
        <GenericFormComponent
            headingText="Create Release"
            icon={NewReleasesIcon}
            isInvalid={!!isDisabled()}
            onChange={onChange}
            onSubmit={onSubmit}
            submitButtonText="Publish"
            data={data}
        />
    );
}

export const CreateNewRelease = withAllProviders(withOriginalOwner(LocalComponent));
