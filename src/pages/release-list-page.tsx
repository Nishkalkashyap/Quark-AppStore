import React, { Component } from 'react'
import { Container, List, Typography, Card, CardContent, Button, CardActions } from '@material-ui/core';
import { withAllProviders } from '../providers/all-providers';
import { basePropType } from '../basePropType';
import { MATCH_PARAMS, ROUTES, POST_SLUG } from '../data/routes';
import queryString from 'query-string';
import { getProjectReleaseCollectionPath, getProjectPath } from '../data/paths';
import { handleFirebaseError } from '../util';
import { ReleaseItem, ProjectData } from '../interfaces';
import { useStylesList } from './project-list-page';
import moment from 'moment';

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
            projectId,
            projectData: {} as any
        }

        this.props.firebase.firestore.doc(getProjectPath(userId, projectId)).get().then((snap) => {
            this.setState({ projectData: snap.data() })
        }).catch((err) => handleFirebaseError(err, this.props, 'Could not fetch project data'))

        const query = startAt ?
            this.props.firebase.firestore.collection(getProjectReleaseCollectionPath(userId, projectId)).limit(10).startAt(startAt) :
            this.props.firebase.firestore.collection(getProjectReleaseCollectionPath(userId, projectId)).limit(10);

        query.get().then((snap) => {
            const arr = snap.docs.map((doc) => doc.data());
            this.setState({ releases: arr });
        }).catch((err) => handleFirebaseError(err, this.props, 'Could not query releases collection'));
    }

    state: { releases: ReleaseItem[], projectData: ProjectData, userId: string, projectId: string };

    render() {
        const styles = {
            fontSize: 14,
            marginRight: '10px',
            borderLeft: 'solid 2px rgba(0, 0, 0, 0.54)',
            paddingLeft: '10px'
        };

        return (
            <Container maxWidth="md">
                <Typography variant="h2" component="h1">
                    {this.state.projectData.projectName}
                </Typography>
                <Typography variant="h4">
                    Project description
                </Typography>
                <Typography component="p">
                    {this.state.projectData.description}
                </Typography>

                <Typography color="textSecondary" component="span" style={styles}>
                    Project ID: {this.state.projectId}
                </Typography>
                {(() => {
                    const keysExist = Object.keys(this.state.projectData).length;
                    return keysExist ? (
                        <React.Fragment>
                            <Typography color="textSecondary" component="span" style={styles}>
                                Created: {moment(this.state.projectData.createdAt.toDate().toLocaleString()).fromNow()}
                            </Typography>
                            <Typography color="textSecondary" component="span" style={styles}>
                                Last updated: {moment(this.state.projectData.updatedAt.toDate().toLocaleString()).fromNow()}
                            </Typography>
                        </React.Fragment>
                    ) : (<div></div>)
                })()}

                <List style={{ marginTop: '30px' }}>
                    {
                        this.state.releases.map((release) => {
                            const obj = { release, history: this.props.history, userID: this.state.userId };
                            return (
                                <ReleaseCard {...obj} key={release.projectId} />
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

const ReleaseCard = (obj: { release: ReleaseItem, history: basePropType['history'], userID: string }) => {
    const classes = useStylesList();
    const { release, history, userID } = obj;
    return (
        <React.Fragment key={release.projectId}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Created: {moment(release.createdAt.toDate().toUTCString()).fromNow()}
                    </Typography>
                    <Typography className={classes.title} gutterBottom>
                        <strong>Notes</strong>
                    </Typography>
                    <Typography variant="body2" component="p" color="textSecondary" className={classes.pos}>
                        {release.notes}
                    </Typography>

                    <Typography className={classes.inline} color="textSecondary" component="span">
                        Last updated: {moment(release.updatedAt.toDate().toUTCString()).fromNow()}
                    </Typography>
                    <Typography className={classes.inline} color="textSecondary" component="span">
                        Release ID: {release.projectId}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" variant="outlined" color="primary" onClick={() => history.push(`${ROUTES.Project}/${userID}/${release.projectId}/${release.releaseId}`)}>View Release</Button>
                </CardActions>
            </Card>
        </React.Fragment>
    )
}

const ReleaseListPage = withAllProviders(LocalComponent);
export { ReleaseListPage }
