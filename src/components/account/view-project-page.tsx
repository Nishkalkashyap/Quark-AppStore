import React, { Component } from 'react'
import { basePropType } from '../login/signup';
import { getProjectReleaseCollectionPath } from '../../data/paths';
import { handleFirebaseError } from '../../util';
import { withFirebase } from '../../services/firebase/firebase.index';
import withAuthorization from '../login/routeGuard';
import { withSnackbar } from 'notistack';
import { ReleaseItem } from '../../interfaces';
import { Button, Container } from '@material-ui/core';
import { useStyles } from '../login/signin';

export class PP extends Component<basePropType & { projectId: string, userID: string }> {
    constructor(props: basePropType & { projectId: string, userID: string }) {
        super(props);
        const currentUser = this.props.firebase.auth.currentUser!;

        const pathname = (window.location.pathname || '').split('/');
        const userId = pathname[2];
        const projectId = pathname[3];
        // console.log(userId, projectId);

        this.state.isCurrentUser = currentUser.uid === userId;

        this.props.firebase.firestore.collection(getProjectReleaseCollectionPath(userId, projectId))
            .get().then((val) => {
                this.setState({ releases: val.docs });
            }).catch((err) => {
                handleFirebaseError(props, err, 'Failed to fetch project releases');
            });
    }

    state = {
        releases: [] as ReleaseItem[],
        isCurrentUser: false
    }


    render() {
        return (<MaterialComponent {...this.state} />)
    }
}

const MaterialComponent = (state: typeof PP['prototype']['state']) => {
    if (state.isCurrentUser) {
        return (<CreateReleaseButton />)
    }

    const ReleaseList = () => {
        return (
            <Container component="main" maxWidth="xs">
                
            </Container>
        )
    };

    return (
        <div>
            Not Owner
        </div>
    )
}

const CreateReleaseButton = (() => {
    const classes = useStyles();
    return (
        <Container component="main" maxWidth="xs">
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Create new release
        </Button>
        </Container>
    )
});

export const ViewProjectPage = withFirebase(withAuthorization(withSnackbar(PP as any)));

