import React, { Component } from 'react'
import { Container, List, Typography, Card, CardContent, CardActions, Button, makeStyles, createStyles } from '@material-ui/core';
import { withAllProviders } from '../providers/all-providers';
import { basePropType } from '../basePropType';
import { MATCH_PARAMS, ROUTES, POST_SLUG } from '../data/routes';
import queryString from 'query-string';
import { getProjectsCollectionPath } from '../data/paths';
import { handleFirebaseError } from '../util';
import { ReleaseItem } from '../interfaces';
import { useStylesList } from './project-list-page';

export default class LocalComponent extends Component<basePropType> {
    constructor(props: basePropType) {
        super(props);

        const values = queryString.parse(props.location.search);
        const userId = props.match.params[MATCH_PARAMS.USER_ID] || props.firebase.auth.currentUser!.uid;
        const projectId = props.match.params[MATCH_PARAMS.PROJECT_ID];
        const startAt = values['startAt'];

        this.state = {
            releases: [],
            userId,
            projectId
        }

        // const query = startAt ?
        //     this.props.firebase.firestore.collection(getProjectsCollectionPath(userId)).limit(10).startAt(startAt) :
        //     this.props.firebase.firestore.collection(getProjectsCollectionPath(userId)).limit(10);

        // query.get().then((snap) => {
        //     const arr = snap.docs.map((doc) => doc.data());
        //     this.setState({ projects: arr });
        // }).catch((err) => handleFirebaseError(err, this.props, 'Could not query projects collection.'));
    }

    state: { releases: ReleaseItem[], userId: string, projectId: string };

    render() {
        return (
            <Container maxWidth="md">
                <Typography variant="h2" component="h1">
                    Project releases
                </Typography>
                <List style={{ marginTop: '30px' }}>
                    {
                        this.state.releases.map((release) => {
                            const obj = { release, history: this.props.history, userID: this.state.userId };
                            return (
                                <ProjectCard {...obj} key={release.projectId} />
                            )
                        })
                    }
                </List>
                <Button
                    style={{ marginTop: '30px' }}
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => this.props.history.push(`${ROUTES.NewRelease}/${this.state.userId}/${this.state.projectId}/${POST_SLUG.NewRelease}`)}
                >
                    Create new release
                </Button>
            </Container>
        )
    }
}

const ProjectCard = (obj: { release: ReleaseItem, history: basePropType['history'], userID: string }) => {
    const classes = useStylesList();
    const { release, history, userID } = obj;
    return (
        <React.Fragment key={release.projectId}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Created At: {release.createdAt.toDate().toUTCString()}
                    </Typography>
                    <Typography variant="body2" component="p" color="textSecondary" className={classes.pos}>
                        {release.notes}
                    </Typography>

                    <Typography className={classes.inline} color="textSecondary" component="span">
                        Updated At: {release.updatedAt.toDate().toUTCString()}
                    </Typography>
                    <Typography className={classes.inline} color="textSecondary" component="span">
                        Release ID: {release.projectId}
                    </Typography>
                </CardContent>
                {/* <CardActions>
                    <Button size="small" variant="outlined" color="primary" onClick={() => history.push(`${ROUTES.Project}/${userID}/${release.projectId}`)}>View Release</Button>
                </CardActions> */}
            </Card>
        </React.Fragment>
    )
}

const ReleaseListPage = withAllProviders(LocalComponent);
export { ReleaseListPage }
