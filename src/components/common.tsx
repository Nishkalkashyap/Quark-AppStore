import './common.css';
import * as React from 'react';
import { Link, Button } from '@material-ui/core';
import { ROUTES } from '../data/routes';
import { basePropType } from '../basePropType';
import { Firebase, withFirebase } from '../services/firebase/firebase.index';
export const UploadButton = () => {
    return (
        <div className="upload-btn-wrapper" style={{ display: 'block' }}>
            <Link variant="body2">Upload photo</Link>
            <input type="file" name="myfile" />
        </div>
    )
}

export const NotFoundComponent = (props: basePropType) => {
    return (
        <Link variant="body2" color="error" href="#" onClick={() => props.history.push(ROUTES.LANDING)} style={{ display: 'block' }}>
            404 Not Found
        </Link>
    )
}


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