import React, { useState, useEffect } from 'react'
import { basePropType } from '../basePropType';
import { ProjectData, ProjectStats, ReleaseItem } from '../interfaces';
import { Card, Typography, CardContent, Chip, CardActions, ButtonGroup, Button } from '@material-ui/core';
import CardBgComponent from './main-background-component';
import { NEW_ROUTES } from '../data/routes';
import Rating from '@material-ui/lab/Rating';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CategoryIcon from '@material-ui/icons/Category';
import EditDownloadIcon from '@material-ui/icons/Edit';
import RateReviewIcon from '@material-ui/icons/RateReview';
import ReportIcon from '@material-ui/icons/Report';
import UpdateDownloadIcon from '@material-ui/icons/Update';
import moment from 'moment';
import { StandardProperties } from 'csstype';
import { downloadReleaseItem, COLORS } from '../util';
import { getDocument_project, getDocument_stats } from '../data/paths';
import { isEqual } from 'lodash';

export const ProjectCardComponent = (LocalComponent);

function LocalComponent(props: basePropType & {
    userId: string,
    latestRelease?: ReleaseItem,
    children?: any,
    projectId: string,
    methods?: {
        showDeleteProjectDialog: () => void
    }
}) {

    const { methods, userId, projectId, isOwner, history, children, latestRelease } = props;

    const [projectData, setProjectData] = useState({} as ProjectData);
    const [projectStats, setProjectStats] = useState({} as ProjectStats);

    useEffect(() => {
        const listener1 = props.firebase.getListenerForDocument(props.firebase.firestore.doc(getDocument_project(userId, projectId)), (snap) => {
            const data = (snap.data() || {}) as any;
            if (!isEqual(projectData, data)) {
                setProjectData(data);
            }
        });

        const listener2 = props.firebase.getListenerForDocument(props.firebase.firestore.doc(getDocument_stats(userId, projectId)), (snap) => {
            const data = (snap.data() || {}) as any;
            if (!isEqual(projectStats, data)) {
                setProjectStats(data);
            }
        });

        return () => { listener1(); listener2() };
    });


    const chipStyle: StandardProperties = {
        color: 'inherit', borderColor: 'inherit', marginTop: '15px', marginRight: '15px'
    }
    const chipDownloadIcon: StandardProperties = {
        color: 'inherit'
    }

    let buildFile: string | undefined;
    let projectFile: string | undefined;

    if (latestRelease && latestRelease.assets) {
        buildFile = latestRelease.assets.find((val) => val.endsWith('.build.qrk'));
        projectFile = latestRelease.assets.find((val) => val.endsWith('.qrk') && !val.endsWith('.build.qrk'));
    }

    return (
        <React.Fragment>
            <Card style={{ position: 'relative', margin: '40px 0px', padding: '40px 40px', background: 'transparent', color: COLORS.BACKGROUND }} elevation={4}>
                <CardBgComponent dotColor="#00000000" bgColor={COLORS.ON_PRIMARY} type="linear" />
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
                    {(latestRelease && latestRelease.assets) && <CardContent style={{ minWidth: '200px' }}>
                        {projectFile && <Button variant="contained" onClick={() => downloadReleaseItem({ ...props, release: latestRelease, filename: projectFile! })} color="primary" style={{ margin: '10px 0px', display: 'block', width: '100%', boxShadow: 'none' }}>
                            Download project
                        </Button>}
                        {buildFile && <Button variant="outlined" onClick={() => downloadReleaseItem({ ...props, release: latestRelease, filename: buildFile! })} color="primary" style={{ margin: '10px 0px', display: 'block', width: '100%' }}>
                            Download build
                        </Button>}
                        <Button variant="text" color="primary" style={{ margin: '10px 0px', display: 'block', width: '100%' }} onClick={() => props.history.push(`/${props.urlUserId}/${props.urlProjectId}/${NEW_ROUTES.RELEASE_LIST_PAGE.base}`)}>
                            See all releases
                        </Button>
                    </CardContent>}
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
                        <Button onClick={() => props.history.push(`/${userId}/${projectData.projectId}/${NEW_ROUTES.CREATE_RELEASE.base}`)}>
                            Create new release
                        <NewReleasesIcon fontSize="small" style={{ marginLeft: '10px' }} />
                        </Button>
                        <Button onClick={() => props.history.push(`/${userId}/${projectData.projectId}/${NEW_ROUTES.EDIT_PROJECT_PAGE.base}`)}>
                            Edit Project
                        <EditIcon fontSize="small" style={{ marginLeft: '10px' }} />
                        </Button>
                        <Button onClick={() => methods.showDeleteProjectDialog()}>
                            Delete project
                        <DeleteIcon fontSize="small" style={{ marginLeft: '10px' }} />
                        </Button>
                    </ButtonGroup>
                </CardActions>}
                {<CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ButtonGroup size="small" aria-label="small outlined button group" color="inherit">
                        <Button onClick={() => history.push(`/${userId}/${projectData.projectId}/${NEW_ROUTES.PROJECT_REVIEW_PAGE.base}`)}>
                            Write Review
                        <RateReviewIcon fontSize="small" style={{ marginLeft: '10px' }} />
                        </Button>
                        <Button variant="outlined" color="inherit" style={{ color: COLORS.DANGER }} onClick={() => props.history.push(`/${props.urlUserId}/${props.urlProjectId}/${NEW_ROUTES.REPORT_ABUSE_PAGE.base}`)}>
                            Report abuse
                        <ReportIcon fontSize="small" style={{ marginLeft: '10px' }} />
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
