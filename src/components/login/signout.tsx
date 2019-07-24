import React from 'react';

import { withFirebase, Firebase } from '../../services/firebase/firebase.index';
import { Button } from '@material-ui/core';

const SignOutButton = ({ firebase }: { firebase: Firebase }) => (
  <Button
    variant="contained"
    color="primary"
    onClick={firebase.doSignOut}
  >
    Sign Out
</Button>
);

export default withFirebase(SignOutButton);