import React, { useState } from 'react'
import { basePropType } from "../../basePropType";
import { Container, CssBaseline, Avatar, Typography, TextField, Button, Grid, Paper } from '@material-ui/core';
import { withFirebase } from '../../services/firebase/firebase.index';
import withAuthorization from '../login/routeGuard';
import { withSnackbar } from 'notistack';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import { useStyles } from '../login/signin';
import { StandardProperties } from 'csstype';
const DropToUpload = require('react-drop-to-upload').default;

const filesToUploa: FilesToUpload = {};
const INITIAL_STATE = {
    notes: '',
    filesToUpload: filesToUploa
}

type FilesToUpload = { [key: string]: { buffer: ArrayBuffer, file: File } };
const LocalComponent = (props: basePropType) => {

    const [state, setState] = useState(INITIAL_STATE);

    const classes = useStyles();
    const onSubmit = (event: any) => {
        event.preventDefault();
    }

    const onChange = (event: any) => {
        setState({ ...state, notes: event.target.value });
        console.log(state);
    }

    const addFiles = (ftu: FilesToUpload) => {
        setState({ ...state, filesToUpload: ftu });
    }

    function isDisabled() {
        // return state.notes == '' || !filesToUpload['md.md']
        return state.notes == '';
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

const DropZone = (obj: { addFiles: Function }) => {
    const style: StandardProperties = {
        minHeight: '100px',
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

    return (
        <DropToUpload style={style} onDropArrayBuffer={onDropArrayBuffer}>
            Drop file here to upload
        </DropToUpload>
    )
}

export const CreateNewRelease = withFirebase(withAuthorization(withSnackbar(LocalComponent as any)));
