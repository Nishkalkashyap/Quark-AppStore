import React, { Component } from 'react'
import { basePropType } from '../login/signup';
import { getProjectReleaseCollectionPath } from '../../data/paths';
import { handleFirebaseError } from '../../util';
import { withFirebase } from '../../services/firebase/firebase.index';
import withAuthorization from '../login/routeGuard';
import { withSnackbar } from 'notistack';

export class PP extends Component<basePropType & { projectId: string, userID: string }> {
    constructor(props: basePropType & { projectId: string, userID: string }) {
        super(props);
        const currentUser = this.props.firebase.auth.currentUser!;
        const pathname = (window.location.pathname || '').split('/');
        const userId = pathname[1];
        const projectId = pathname[2];
        this.props.firebase.firestore.collection(getProjectReleaseCollectionPath(userId, projectId))
            .get().then((val) => {
                console.log(val);
            }).catch((err) => {
                handleFirebaseError(props, err, 'Failed to fetch project releases');
            });
    }

    releases: any[] = [];

    render() {
        return (
            <div>

            </div>
        )
    }
}

export const ViewProjectPage = withFirebase(withAuthorization(withSnackbar(PP as any)));

