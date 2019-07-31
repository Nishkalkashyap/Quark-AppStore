import React from 'react'
import { withAllProviders } from '../providers/all-providers';
import { basePropType } from '../basePropType';
import { ProjectData, ProjectStats } from '../interfaces';
import { Card, Typography, CardContent, Chip, CardActions, ButtonGroup, Button } from '@material-ui/core';
import MainBgComponent, { MainBgContainerStyles } from './main-background-component';
import { ROUTES, POST_SLUG } from '../data/routes';
import Rating from '@material-ui/lab/Rating';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CategoryIcon from '@material-ui/icons/Category';
import EditDownloadIcon from '@material-ui/icons/Edit';
import RateReviewIcon from '@material-ui/icons/RateReview';
import UpdateDownloadIcon from '@material-ui/icons/Update';
import moment from 'moment';
import { StandardProperties } from 'csstype';

export const ProjectCardComponent = withAllProviders(LocalComponent);

function LocalComponent(props: basePropType & {
    projectData: ProjectData,
    userId: string,
    projectStats: ProjectStats,
    methods: {
        showDeleteProjectDialog: () => void
    }
}) {

    const { projectData, projectStats, methods, userId, isOwner, history } = props;
    const chipStyle: StandardProperties = {
        color: '#ffffff', borderColor: '#ffffff', marginTop: '15px', marginRight: '15px'
    }
    const chipDownloadIcon: StandardProperties = {
        color: '#ffffff'
    }

    return (
        <Card style={MainBgContainerStyles}>
            <MainBgComponent />
            <Typography variant="h2" component="h1" color="inherit">
                {projectData.projectName || 'Project'}
            </Typography>
            <CardContent>
                <Typography component="h3" color="inherit" style={{ marginBottom: '20px' }}>
                    {projectData.tagline || 'Tag line'}
                </Typography>
                <Typography variant="h5" color="inherit">
                    Description
                            </Typography>
                <Typography component="p" color="inherit">
                    {projectData.description}
                </Typography>
            </CardContent>
            <CardContent>
                {Object.keys(projectData).length &&
                    (<React.Fragment>
                        <Chip label={`Downloads: ${projectStats.numberOfDownloads}`} variant="outlined" size="small" icon={<CloudDownloadIcon style={chipDownloadIcon} />} style={chipStyle} />
                        <Chip label={`Category: ${projectData.category}`} variant="outlined" size="small" icon={<CategoryIcon style={chipDownloadIcon} />} style={chipStyle} />
                        <Chip label={`Created: ${moment(projectData.createdAt.toDate().toISOString(), moment.ISO_8601).fromNow()}`} variant="outlined" size="small" icon={<EditDownloadIcon style={chipDownloadIcon} />} style={chipStyle} />
                        <Chip label={`Last updated: ${moment(projectData.updatedAt.toDate().toISOString(), moment.ISO_8601).fromNow()}`} variant="outlined" size="small" icon={<UpdateDownloadIcon style={chipDownloadIcon} />} style={chipStyle} />
                    </React.Fragment>)}
            </CardContent>
            {isOwner && <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ButtonGroup size="small" aria-label="small outlined button group" color="inherit">
                    <Button onClick={() => props.history.push(`${ROUTES.NEW_RELEASE}/${userId}/${projectData.projectId}/${POST_SLUG.NEW_RELEASE}`)}>
                        Create new release
                                    <NewReleasesIcon fontSize="small" style={{ marginLeft: '10px' }} />
                    </Button>
                    <Button onClick={() => props.history.push(`${ROUTES.EDIT_PROJECT_PAGE}/${userId}/${projectData.projectId}`)}>
                        Edit Project
                                    <EditIcon fontSize="small" style={{ marginLeft: '10px' }} />
                    </Button>
                    <Button onClick={() => methods.showDeleteProjectDialog()}>
                        Delete project
                                    <DeleteIcon fontSize="small" style={{ marginLeft: '10px' }} />
                    </Button>
                </ButtonGroup>
            </CardActions>}
            <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ButtonGroup size="small" aria-label="small outlined button group" color="inherit">
                    <Button onClick={() => history.push(`${ROUTES.PROJECT_REVIEW_PAGE}/${userId}/${projectData.projectId}`)}>
                        Write Review
                                    <RateReviewIcon fontSize="small" style={{ marginLeft: '10px' }} />
                    </Button>
                </ButtonGroup>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography color="inherit" variant="body1">{projectStats.numberOfReviews}</Typography>
                    <Rating style={{ margin: '10px 10px' }} value={projectStats.averageRating} readOnly />
                </div>
            </CardActions>
        </Card>

    )
}
