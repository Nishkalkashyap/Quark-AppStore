import React, { useState } from 'react'
import { basePropType } from "../../basePropType";
import { Container, CssBaseline, Avatar, Typography, TextField, Button, Grid, Paper } from '@material-ui/core';
import { withFirebase } from '../../services/firebase/firebase.index';
import withAuthorization from '../login/routeGuard';
import { withSnackbar } from 'notistack';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import { useStyles } from '../login/signin';
import { StandardProperties } from 'csstype';
// import DropToUpload from 'react-drop-to-upload';
const DropToUpload = require('react-drop-to-upload').default;

const INITIAL_STATE = {
    notes: ''
}

const LocalComponent = (props: basePropType) => {

    const [state, setState] = useState(INITIAL_STATE);

    const classes = useStyles();
    const onSubmit = (event: any) => {
        console.log('On Submit');
        event.preventDefault();
    }

    const onChange = (event: any) => {
        setState({ notes: event.target.value });
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
                    <DropZone />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={!!!state.notes.length}
                    >
                        Publish
                    </Button>
                </form>
            </div>
        </Container>
    )
}

const DropZone = () => {
    const style: StandardProperties = {
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px dashed #bbb`,
        boxShadow: 'none'
    }

    const onDrop = (e: File[], p: any) => {
        // console.log('Dropped', e, p);
    }

    const onDropArrayBuffer = (buffers: ArrayBuffer[], files: File[]) => {
        console.log(buffers, files);
    }

    return (
        <DropToUpload style={style} onDrop={onDrop} onDropArrayBuffer={onDropArrayBuffer}>
            Drop file here to upload
        </DropToUpload>
    )
}

export const CreateNewRelease = withFirebase(withAuthorization(withSnackbar(LocalComponent as any)));
