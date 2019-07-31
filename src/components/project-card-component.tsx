import React from 'react'
import { basePropType } from '../basePropType';
import { ProjectData, ProjectStats, ReleaseItem } from '../interfaces';
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

export const ProjectCardComponent = (LocalComponent);

function LocalComponent(props: basePropType & {
    projectData: ProjectData,
    userId: string,
    projectStats: ProjectStats,
    latestRelease?: ReleaseItem,
    children?: any,
    methods?: {
        showDeleteProjectDialog: () => void
    }
}) {

    const { projectData, projectStats, methods, userId, isOwner, history, children } = props;
    const chipStyle: StandardProperties = {
        color: 'inherit', borderColor: 'inherit', marginTop: '15px', marginRight: '15px'
    }
    const chipDownloadIcon: StandardProperties = {
        color: 'inherit'
    }

    return (
        <React.Fragment>
            <Card style={Object.assign({}, MainBgContainerStyles, { color: null })} elevation={4}>
                <MainBgComponent bgColor="#ffffff" />
                <Typography variant="h2" component="h1" color="inherit">
                    {projectData.projectName || 'Project'}
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <CardContent style={{ flexGrow: 2, flexBasis: 66 }}>
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
                    <CardContent style={{ minWidth: '200px' }}>
                        <Button variant="contained" color="primary" style={{ margin: '10px 0px', display: 'block', width: '100%', boxShadow: 'none' }}>
                            Download project
                        </Button>
                        <Button variant="outlined" color="primary" style={{ margin: '10px 0px', display: 'block', width: '100%' }}>
                            Download build
                        </Button>
                        <Button variant="text" color="primary" style={{ margin: '10px 0px', display: 'block', width: '100%' }} onClick={() => props.history.push(`${ROUTES.RELEASE_LIST_PAGE}/${props.urlUserId}/${props.urlProjectId}`)}>
                            See all releases
                        </Button>
                    </CardContent>
                </div>
                <CardContent>
                    {Object.keys(projectData).length &&
                        (<React.Fragment>
                            <Chip label={`Downloads: ${projectStats.numberOfDownloads || 0}`} variant="outlined" size="small" icon={<CloudDownloadIcon style={chipDownloadIcon} />} style={chipStyle} />
                            <Chip label={`Category: ${projectData.category}`} variant="outlined" size="small" icon={<CategoryIcon style={chipDownloadIcon} />} style={chipStyle} />
                            <Chip label={`Created: ${moment(projectData.createdAt.toDate().toISOString(), moment.ISO_8601).fromNow()}`} variant="outlined" size="small" icon={<EditDownloadIcon style={chipDownloadIcon} />} style={chipStyle} />
                            <Chip label={`Last updated: ${moment(projectData.updatedAt.toDate().toISOString(), moment.ISO_8601).fromNow()}`} variant="outlined" size="small" icon={<UpdateDownloadIcon style={chipDownloadIcon} />} style={chipStyle} />
                        </React.Fragment>)}
                </CardContent>
                {(isOwner && methods) && <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                {(isOwner && methods) && <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ButtonGroup size="small" aria-label="small outlined button group" color="inherit">
                        <Button onClick={() => history.push(`${ROUTES.PROJECT_REVIEW_PAGE}/${userId}/${projectData.projectId}`)}>
                            Write Review
                        <RateReviewIcon fontSize="small" style={{ marginLeft: '10px' }} />
                        </Button>
                    </ButtonGroup>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography color="inherit" variant="body1">{projectStats.numberOfReviews || 0}</Typography>
                        <Rating style={{ margin: '10px 10px' }} value={projectStats.averageRating || 0} readOnly />
                    </div>
                </CardActions>}
                {children}
            </Card>
        </React.Fragment>
    )
}
