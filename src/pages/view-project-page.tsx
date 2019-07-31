import React, { Component } from 'react'
import { basePropType } from "../basePropType";
import { getReleaseListCollectionPath, getProjectDocPath } from '../data/paths';
import { handleFirebaseError } from '../util';
import { ReleaseItem, ProjectData } from '../interfaces';
import { Button, Container, Typography } from '@material-ui/core';
import { ROUTES, POST_SLUG, MATCH_PARAMS } from '../data/routes';
import { useStyles } from '../components/common-components';
import { withAllProviders } from '../providers/all-providers';

export class PP extends Component<basePropType & { projectId: string, userID: string }> {
    constructor(props: basePropType & { projectId: string, userID: string }) {
        super(props);
        const currentUser = this.props.firebase.auth.currentUser!;

        const userId = this.props.match.params[MATCH_PARAMS.USER_ID];
        const projectId = this.props.match.params[MATCH_PARAMS.PROJECT_ID];

        this.state.isCurrentUser = currentUser.uid === userId;

        this.listeners.push(
            this.props.firebase.firestore.doc(getProjectDocPath(userId, projectId))
                .onSnapshot((snap) => {
                    this.setState({ metaData: snap.data() });
                }, (err) => handleFirebaseError(props, err, 'Failed to fetch project data'))
        );

        this.listeners.push(
            this.props.firebase.firestore.collection(getReleaseListCollectionPath(userId, projectId))
                .onSnapshot((snap) => {
                    const docs = snap.docs;
                    this.setState({ releases: docs.map((doc) => doc.data()) });
                }, (err) => handleFirebaseError(props, err, 'Failed to fetch project releases'))
        );
    }

    state = {
        releases: [] as ReleaseItem[],
        isCurrentUser: false,
        metaData: {} as ProjectData
    }

    listeners: Function[] = [];
    componentWillUnmount() { this.listeners.map((listener) => { listener() }) };


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
        <Container component="section" maxWidth="md">
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
            <Container component="section" maxWidth="sm">
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={() => context.props.history.push(`${ROUTES.PROJECT_PAGE}/${context.props.match.params[MATCH_PARAMS.USER_ID]}/${context.props.match.params[MATCH_PARAMS.PROJECT_ID]}/${POST_SLUG.NEW_RELEASE}`)}
                >
                    Create new release
            </Button>
            </Container>
        )
    });

    const ReleaseList = () => {
        return (
            <Container component="section" maxWidth="xs">
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

