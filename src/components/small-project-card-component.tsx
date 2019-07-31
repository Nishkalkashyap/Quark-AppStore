import React from 'react'
import { basePropType } from '../basePropType';
import { ProjectData } from '../interfaces';
import logo from './../assets/logo.svg';
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button, makeStyles, createStyles } from '@material-ui/core';
import { ROUTES } from '../data/routes';

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

    return (
        <Card className={classes.card}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={projectData.coverImageUrl || logo}
                    title="Contemplative Reptile"
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
        </Card>
    )
}
