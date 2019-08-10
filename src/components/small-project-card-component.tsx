import React, { useState, useEffect } from 'react'
import { basePropType } from '../basePropType';
import { ProjectData, ProjectStats } from '../interfaces';
import logo from './../assets/logo.svg';
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button, makeStyles, createStyles, CardHeader, Avatar } from '@material-ui/core';
import { NEW_ROUTES } from '../data/routes';
import { getDocument_stats } from '../data/paths';
import { isEqual } from 'lodash';
import Rating from '@material-ui/lab/Rating';
import moment from 'moment';
import { StandardProperties } from 'csstype';
import { Highlight } from 'react-instantsearch-dom';

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

export const smallProjectContainerStyles: StandardProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
}

export function SmallProjectCardComponent(props: basePropType & { projectData: ProjectData, isAlgoliaComponent?: boolean }) {

    const classes = useStyles();
    const { projectData } = props;

    const [projectStats, setProjectStats] = useState({} as ProjectStats);
    useEffect(() => {
        const listener = props.firebase.getListenerForDocument(props.firebase.firestore.doc(getDocument_stats(projectData.userId, projectData.projectId)), (snap) => {
            const data = (snap.data() || {}) as any;
            if (!isEqual(projectStats, data)) {
                setProjectStats(data);
            }
        });

        return listener;
    });

    return (
        <Card className={classes.card} style={{ minWidth: '300px', maxWidth: '340px', flexGrow: 1, margin: '20px 10px' }}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe">
                        {projectData.category.charAt(0)}
                    </Avatar>
                }
                title={projectData.category}
                subheader={moment(projectData.createdAt.toDate().toISOString(), moment.ISO_8601).fromNow()}
            />
            <CardActionArea onClick={() => props.history.push(`/${projectData.userId}/${projectData.projectId}/${NEW_ROUTES.PROJECT_PAGE.base}`)}>
                <CardMedia
                    component={(projectData.coverImageUrl || logo).includes('.mp4') ? "video" : 'img'}
                    className={classes.media}
                    image={projectData.coverImageUrl || logo}
                    title={projectData.tagline}

                    autoPlay
                    muted
                    loop
                    style={{ minHeight: '200px' }}

                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {!props.isAlgoliaComponent && projectData.projectName}
                        {props.isAlgoliaComponent && <Highlight attribute="projectName" hit={projectData}></Highlight>}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {!props.isAlgoliaComponent && projectData.description}
                        {props.isAlgoliaComponent && <Highlight attribute="description" hit={projectData}></Highlight>}
                    </Typography>
                </CardContent>
            </CardActionArea>
            {projectStats.numberOfReviews && <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size="small" color="primary" onClick={() => props.history.push(`/${projectData.userId}/${projectData.projectId}/${NEW_ROUTES.RELEASE_LIST_PAGE.base}`)}>
                    reviews
                </Button>
                <Rating size="small" style={{ margin: '10px 10px' }} value={projectStats.averageRating || 0} readOnly />
            </CardActions>}
        </Card>
    )
}
