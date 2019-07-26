import { merge } from 'lodash';
import React, { useState } from 'react'
import { basePropType } from "../../basePropType";
import { Container, CssBaseline, Avatar, Typography, TextField, Button, Grid, Paper, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, IconButton, List } from '@material-ui/core';
import { withFirebase } from '../../services/firebase/firebase.index';
import withAuthorization from '../login/routeGuard';
import { withSnackbar } from 'notistack';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useStyles } from '../../pages/sign-in-page';
import { StandardProperties } from 'csstype';
import { useForceUpdate, getRandomId, handleFirebaseError } from '../../util';
import { URL_KEYS, ROUTES } from '../../data/routes';
import firebase from 'firebase';
import { getProjectReleaseDocPath } from '../../data/paths';
import { ReleaseItem } from '../../interfaces';
const DropToUpload = require('react-drop-to-upload').default;

type FilesToUpload = { [key: string]: { buffer: ArrayBuffer, file: File } };
const filesToUploa: FilesToUpload = {};
const INITIAL_STATE = {
    notes: '',
    filesToUpload: filesToUploa,
    uploadSize: 0
}

const FILE_UPLOAD_LIMIT = 20000000;

const LocalComponent = (props: basePropType) => {

    const [state, setState] = useState(INITIAL_STATE);

    const classes = useStyles();
    const onSubmit = (event: any) => {
        event.preventDefault();

        const releaseId = getRandomId();
        const createdAt = firebase.firestore.FieldValue.serverTimestamp();
        const userId = props.match.params[URL_KEYS.USER_ID];
        const projectId = props.match.params[URL_KEYS.PROJECT_ID];

        const releaseData: ReleaseItem = {
            updatedAt: createdAt,
            createdAt,
            releaseId,
            projectId,
            notes: state.notes
        }

        props.firebase.firestore.doc(getProjectReleaseDocPath(userId, projectId, releaseId)).set(releaseData)
            .then(() => {
                props.enqueueSnackbar('Release created', { variant: 'success' });
                props.enqueueSnackbar('Uploading files', { variant: 'info' });

                uploadFilesToBucket()
                    .then(() => {
                        props.enqueueSnackbar('Files uploaded', { variant: 'success' });
                    })
                    .catch((err) => handleFirebaseError(props, err, 'Failed to upload files'))
                    .finally(() => {
                        props.history.push(`${ROUTES.Project}/${userId}/${projectId}`);
                    })
            })
            .catch((err) => {
                handleFirebaseError(props, err, 'Failed to create project');
            })

        async function uploadFilesToBucket() {
            const releaseBucketFolder = getProjectReleaseDocPath(userId, projectId, releaseId);
            const bucketUploadPromises = Object.keys(state.filesToUpload).map((key) => {
                const file = state.filesToUpload[key];
                const ref = props.firebase.storage.ref(`${releaseBucketFolder}/${file.file.name}`);
                return ref.put(file.buffer);
            });
            return Promise.all(bucketUploadPromises);
        }
    }

    const forceUpdate = useForceUpdate();

    const onChange = (event: any) => {
        setState({ ...state, notes: event.target.value });
    }

    const addFiles = (ftu: FilesToUpload) => {

        const nonRequiredFiles = Object.keys(ftu).filter((key) => {
            return !(key.endsWith('.qrk') || key == 'package.json' || key.endsWith('.ino'))
        });


        if (nonRequiredFiles.length) {
            nonRequiredFiles.map((file) => {
                delete ftu[file];
            });
            props.enqueueSnackbar('You can only upload *.qrk, *.build.qrk, package.json and *.ino file', { variant: 'error' });
            props.enqueueSnackbar('Some files were removed', { variant: 'error' });
        }

        const finalObject: typeof INITIAL_STATE = merge(state, { filesToUpload: ftu });

        let size = 0;
        Object.keys(finalObject.filesToUpload).map((key) => {
            size = size + finalObject.filesToUpload[key].file.size;
        });

        if (size > FILE_UPLOAD_LIMIT) {
            props.enqueueSnackbar('Total upload size must be less than 20MB', { variant: 'error' });
        }

        finalObject.uploadSize = size;

        setState({ ...finalObject });
    }

    function isDisabled() {
        const keys = Object.keys(state.filesToUpload);

        if (keys.length == 0) return true;
        if (state.uploadSize > 20000000) return true;
        if (state.notes == '') return true;

        const buildFileExists = !!keys.find((key) => key.match(/\.build\.(qrk)$/));
        const projectFileExists = !!keys.find((key) => key.match(/\.(qrk)$/) && key.search('.build.qrk') == -1);

        if (!buildFileExists || !projectFileExists) return true;
        return false;
    }

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <NewReleasesIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Create Release
                </Typography>
                <form className={classes.form} onSubmit={onSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth

                        id="notes"
                        label="Notes"
                        name="notes"
                        type="text"
                        autoFocus

                        multiline
                        rows="4"

                        onChange={onChange}
                    />
                    <DropZone addFiles={addFiles as any} />
                    <ListComponent files={state.filesToUpload as any} forceUpdate={forceUpdate as any}></ListComponent>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={!!isDisabled()}
                    >
                        Publish
                    </Button>
                </form>
            </div>
        </Container>
    )
}

const ListComponent = (props: { files: FilesToUpload, forceUpdate: Function }) => {

    const deleteKey = (key: string) => {
        delete props.files[key];
        props.forceUpdate();
    }

    const getSecondary = (bytes: number) => {
        if (bytes < 1000) {
            return `${bytes} bytes`;
        }

        if (bytes < 1000000) {
            return `${Math.floor(bytes / 1000)} kilobytes`;
        }

        if (bytes < 1000000000) {
            return `${Math.floor(bytes / 1000000)} megabytes`;
        }

        return `${bytes} bytes`;
    }

    return (
        <List>
            {Object.keys(props.files).map((key) => {
                return (
                    <ListItem key={key + props.files[key].file.size}>
                        <ListItemText
                            primary={key}
                            secondary={getSecondary(props.files[key].file.size)}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={() => deleteKey(key)}>
                                <DeleteForeverIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            })}
        </List>
    )
}

const DropZone = (obj: { addFiles: Function }) => {
    const style: StandardProperties = {
        minHeight: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px dashed #bbb`,
        boxShadow: 'none'
    }

    const onDropArrayBuffer = (buffers: ArrayBuffer[], files: File[]) => {
        const filesToUpload: FilesToUpload = {};
        files.map((file, index) => {
            filesToUpload[file.name] = {
                file,
                buffer: buffers[index]
            }
        });
        obj.addFiles(filesToUpload);
    }

    const id = "fksdbkfskd-fsdfs-fsdfsd-fsd-fsdf-fds";

    const highlight = (e: MouseEvent) => {
        document.getElementById(id)!.className = "drop-to-upload-highlight";
    }

    const unhighlight = (e: MouseEvent) => {
        document.getElementById(id)!.className = "drop-to-upload-unhighlight";
    }

    return (
        <div onDragEnter={highlight as any} onDropCapture={unhighlight as any} onMouseLeave={unhighlight as any} id={id}>
            <DropToUpload style={style} onDropArrayBuffer={onDropArrayBuffer}>
                Drop files here to upload
            </DropToUpload>
        </div>
    )
}

export const CreateNewRelease = withFirebase(withAuthorization(withSnackbar(LocalComponent as any)));
