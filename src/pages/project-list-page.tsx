import React, { Component } from 'react'
import { Container, List, Typography, Card, CardContent, CardActions, Button, makeStyles, createStyles } from '@material-ui/core';
import { withAllProviders } from '../providers/all-providers';
import { basePropType } from '../basePropType';
import { MATCH_PARAMS, ROUTES } from '../data/routes';
import queryString from 'query-string';
import { getProjectsCollectionPath } from '../data/paths';
import { handleFirebaseError } from '../util';
import { ProjectData } from '../interfaces';
import moment from 'moment';

export const useStylesList = makeStyles(
    createStyles({
        card: {
            minWidth: 275,
            marginBottom : '45px'
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 14,
        },
        pos: {
            marginBottom: 12,
        },
        inline: {
            fontSize: 14,
            marginRight: '10px',
            borderLeft: 'solid 2px rgba(0, 0, 0, 0.54)',
            paddingLeft: '10px'
        },
    }),
);

export default class LocalComponent extends Component<basePropType> {
    constructor(props: basePropType) {
        super(props);

        const values = queryString.parse(props.location.search);
        const userId = props.match.params[MATCH_PARAMS.USER_ID] || props.firebase.auth.currentUser!.uid;
        this.state.userId = userId;
        const startAt = values['startAt'];
        console.log(values);

        const query = startAt ?
            this.props.firebase.firestore.collection(getProjectsCollectionPath(userId)).limit(10).startAt(startAt) :
            this.props.firebase.firestore.collection(getProjectsCollectionPath(userId)).limit(10);

        query.get().then((snap) => {
            const arr = snap.docs.map((doc) => doc.data());
            this.setState({ projects: arr });
        }).catch((err) => handleFirebaseError(err, this.props, 'Could not query projects collection.'));
    }

    state: { projects: ProjectData[], userId: string } = { projects: [], userId: '' };

    render() {
        return (
            <Container maxWidth="md">
                <Typography variant="h2" component="h1">
                    Your Projects
                </Typography>
                <List style={{ marginTop: '30px' }}>
                    {
                        this.state.projects.map((project) => {
                            const obj = { project, history: this.props.history, userID: this.state.userId };
                            return (
                                <ProjectCard {...obj} key={project.projectId} />
                            )
                        })
                    }
                </List>
                <Button
                    style={{ marginTop: '30px' }}
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => this.props.history.push(ROUTES.CREATE_NEW_PROJECT_PAGE)}
                >
                    Create new project
                </Button>
            </Container>
        )
    }
}

const ProjectCard = (obj: { project: ProjectData, history: basePropType['history'], userID: string }) => {
    const classes = useStylesList();
    const { project, history, userID } = obj;
    return (
        <React.Fragment key={project.projectId}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Created: {moment(project.createdAt.toDate().toUTCString()).fromNow()}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {project.projectName}
                    </Typography>
                    <Typography variant="body2" component="p" color="textSecondary" className={classes.pos}>
                        {project.description}
                    </Typography>

                    <Typography className={classes.inline} color="textSecondary" component="span">
                        Number of releases: {project.numberOfReleases}
                    </Typography>
                    <Typography className={classes.inline} color="textSecondary" component="span">
                        Last updated: {moment(project.updatedAt.toDate().toUTCString()).fromNow()}
                    </Typography>
                    <Typography className={classes.inline} color="textSecondary" component="span">
                        Project ID: {project.projectId}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" variant="outlined" color="primary" onClick={() => history.push(`${ROUTES.Project}/${userID}/${project.projectId}`)}>View project</Button>
                </CardActions>
            </Card>
        </React.Fragment>
    )
}

const ProjectsListPage = withAllProviders(LocalComponent);
export { ProjectsListPage }
