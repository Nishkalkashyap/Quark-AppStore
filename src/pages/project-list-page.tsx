import React, { Component } from 'react'
import { Container, List, Typography, Card, CardContent, CardActions, Button, makeStyles, createStyles } from '@material-ui/core';
import { withAllProviders } from '../providers/all-providers';
import { basePropType } from '../basePropType';
import { MATCH_PARAMS } from '../data/routes';
import queryString from 'query-string';
import { getProjectsCollectionPath } from '../data/paths';
import { handleFirebaseError } from '../util';
import { ProjectData } from '../interfaces';

const useStyles = makeStyles(
    createStyles({
        card: {
            minWidth: 275,
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
    }),
);

export default class LocalComponent extends Component<basePropType> {
    constructor(props: basePropType) {
        super(props);

        const values = queryString.parse(props.location.search);
        const userId = props.match.params[MATCH_PARAMS.USER_ID] || props.firebase.auth.currentUser!.uid;
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

    state: { projects: ProjectData[] } = { projects: [] };

    render() {
        return (
            <Container maxWidth="sm">
                <List>
                    {
                        this.state.projects.map((project) => {
                            return (
                                <ProjectCard {...project} key={project.projectId}></ProjectCard>
                            )
                        })
                    }
                </List>
            </Container>
        )
    }
}

const ProjectCard = (project: ProjectData) => {
    const classes = useStyles();
    return (
        <React.Fragment key={project.projectId}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Created at: {project.createdAt.toDate().toUTCString()}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {project.projectName}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {project.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary">View</Button>
                </CardActions>
            </Card>
        </React.Fragment>
    )
}

const ProjectsListPage = withAllProviders(LocalComponent);
export { ProjectsListPage }
