import React, { Component } from 'react'
import { basePropType } from "../basePropType";
import { getProjectReleaseCollectionPath, getProjectPath } from '../data/paths';
import { handleFirebaseError } from '../util';
import { withFirebase } from '../providers/firebase-provider';
import withAuthorization from '../providers/route-guard-provider';
import { withSnackbar } from 'notistack';
import { ReleaseItem, ProjectData } from '../interfaces';
import { Button, Container, Typography } from '@material-ui/core';
import { ROUTES, POST_SLUG, URL_KEYS } from '../data/routes';
import { useStyles } from '../components/common-components';
import { withAllProviders } from '../providers/all-providers';

export class PP extends Component<basePropType & { projectId: string, userID: string }> {
    constructor(props: basePropType & { projectId: string, userID: string }) {
        super(props);
        const currentUser = this.props.firebase.auth.currentUser!;

        const userId = this.props.match.params[URL_KEYS.USER_ID];
        const projectId = this.props.match.params[URL_KEYS.PROJECT_ID];

        this.state.isCurrentUser = currentUser.uid === userId;

        this.props.firebase.firestore.doc(getProjectPath(userId, projectId)).get()
            .then((val) => {
                this.setState({ metaData: val.data() });
            }).catch((err) => {
                handleFirebaseError(props, err, 'Failed to fetch project data');
            });

        this.props.firebase.firestore.collection(getProjectReleaseCollectionPath(userId, projectId)).get()
            .then((val) => {
                const docs = val.docs;
                this.setState({ releases: docs.map((doc) => doc.data()) });
            }).catch((err) => {
                handleFirebaseError(props, err, 'Failed to fetch project releases');
            });
    }

    state = {
        releases: [] as ReleaseItem[],
        isCurrentUser: false,
        metaData: {} as ProjectData
    }


    render() {
        return (
            <div>
                <MetaData {...this.state} />
                <MaterialComponent {...this} />
            </div>
        )
    }
}

const MetaData = ((state: typeof PP['prototype']['state']) => {
    return (
        <Container component="main" maxWidth="md">
            <Typography component="h1" variant="h3">
                {state.metaData.projectName}
            </Typography>
            <Typography component="h6">
                {state.metaData.description}
            </Typography>
        </Container>
    )
});

const MaterialComponent = (context: typeof PP['prototype']) => {
    const CreateReleaseButton = (() => {
        const classes = useStyles();
        return (
            <Container component="main" maxWidth="sm">
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={() => context.props.history.push(`${ROUTES.Project}/${context.props.match.params[URL_KEYS.USER_ID]}/${context.props.match.params[URL_KEYS.PROJECT_ID]}/${POST_SLUG.NewRelease}`)}
                >
                    Create new release
            </Button>
            </Container>
        )
    });

    const ReleaseList = () => {
        return (
            <Container component="main" maxWidth="xs">
                {context.state.releases.map((release) => {
                    return (
                        <div key={release.releaseId}>
                            {release.releaseId}
                        </div>
                    )
                })}
            </Container>
        )
    };

    if (context.state.isCurrentUser) {
        return (
            <div>
                <ReleaseList></ReleaseList>
                <CreateReleaseButton />
            </div>
        )
    }

    return (
        <div>
            <ReleaseList></ReleaseList>
        </div>
    )
}


export const ViewProjectPage = withAllProviders(PP);

