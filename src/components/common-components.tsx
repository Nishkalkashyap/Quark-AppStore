import './common-styles.css';
import * as React from 'react';
import { Link, Button, makeStyles, Typography, Container } from '@material-ui/core';
import { ROUTES } from '../data/routes';
import { basePropType } from '../basePropType';
import { Firebase, withFirebase } from '../providers/firebase-provider';
import { StandardProperties } from 'csstype';
export const UploadButton = () => {
    return (
        <div className="upload-btn-wrapper" style={{ display: 'block' }}>
            <Link variant="body2">Upload photo</Link>
            <input type="file" name="myfile" />
        </div>
    )
}

export const NotFoundComponent = (props: basePropType) => {

    const style: StandardProperties = {
        borderLeft: 'solid 4px var(--ion-color-warning)',
        borderRadius: '3px',
        backgroundColor: 'rgba(var(--ion-color-warning-rgb), 0.05)',
        color: 'rgba(var(--ion-color-dark-rgb), 0.6)',
        padding: '28px'
    }

    return (
        <Container maxWidth="md" >
            <Typography variant="h1">
                404
            </Typography>
            <Typography variant="body1" style={style}>
                Looks like we've got some broken links.
            </Typography>
            <Link style={{ marginTop: '20px', display: 'inline-block', cursor: 'pointer' }} href={ROUTES.LANDING_PAGE}>
                Take me home
            </Link>
        </Container>
    )
}
// <Link variant="body2" color="error" href="#" onClick={() => props.history.push(ROUTES.LANDING)} style={{ display: 'block' }}>
//     404 Not Found
// </Link>

export const useStyles = makeStyles(theme => ({
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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    button: {
        margin: theme.spacing(1)
    },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    }
}));


const signOutButton = ({ firebase }: { firebase: Firebase }) => (
    <Button
        variant="contained"
        color="primary"
        onClick={firebase.doSignOut}
    >
        Sign Out
  </Button>
);

export const SignOutButton = withFirebase(signOutButton);