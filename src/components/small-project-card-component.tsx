import React, { useState, useEffect } from 'react'
import { basePropType } from '../basePropType';
import { ProjectData, ProjectStats } from '../interfaces';
import logo from './../assets/logo.svg';
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button, makeStyles, createStyles, CardHeader, Avatar } from '@material-ui/core';
import { ROUTES } from '../data/routes';
import { getProjectStatsDocPath } from '../data/paths';
import { isEqual } from 'lodash';
import { handleFirebaseError } from '../util';
import Rating from '@material-ui/lab/Rating';
import moment from 'moment';

const useStyles = makeStyles(
    createStyles({
        card: {
            maxWidth: 345,
        },
        media: {
            height: 140,
        },
    }),
);

export function SmallProjectCardComponent(props: basePropType & { projectData: ProjectData }) {

    const classes = useStyles();
    const { projectData } = props;

    const [projectStats, setProjectStats] = useState({} as ProjectStats);
    useEffect(() => {
        const listener = props.firebase.firestore.doc(getProjectStatsDocPath(projectData.userId, projectData.projectId))
            .onSnapshot((snap) => {
                const data = (snap.data() || {}) as any;
                if (!isEqual(projectStats, data)) {
                    setProjectStats(data);
                }
            }, (err) => handleFirebaseError(props, err, 'Failed to fetch user profile'));

        return listener;
    });

    return (
        <Card className={classes.card} style={{ minWidth: '300px', margin: '20px 30px' }}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe">
                        {projectData.category.charAt(0)}
                    </Avatar>
                }
                title={projectData.category}
                subheader={moment(projectData.createdAt.toDate().toISOString(), moment.ISO_8601).fromNow()}
            />
            <CardActionArea onClick={() => props.history.push(`${ROUTES.PROJECT_PAGE}/${projectData.userId}/${projectData.projectId}`)}>
                <CardMedia
                    className={classes.media}
                    image={projectData.coverImageUrl || logo}
                    title={projectData.tagline}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {projectData.projectName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {projectData.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary" onClick={() => props.history.push(`${ROUTES.PROJECT_PAGE}/${projectData.userId}/${projectData.projectId}`)}>
                    View
                </Button>
            </CardActions>
            {projectStats.numberOfReviews && <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size="small" color="primary" onClick={() => props.history.push(`${ROUTES.RELEASE_LIST_PAGE}/${projectData.userId}/${projectData.projectId}`)}>
                    reviews
                </Button>
                <Rating size="small" style={{ margin: '10px 10px' }} value={projectStats.averageRating || 0} readOnly />
            </CardActions>}
        </Card>
    )
}
