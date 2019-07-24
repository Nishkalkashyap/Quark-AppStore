import React from 'react';

import { withFirebase, Firebase } from '../../services/firebase/firebase.index';

const SignOutButton = ({ firebase }: { firebase: Firebase }) => (
    <button type="button" onClick={firebase.doSignOut}>
        Sign Out
  </button>
);

export default withFirebase(SignOutButton);