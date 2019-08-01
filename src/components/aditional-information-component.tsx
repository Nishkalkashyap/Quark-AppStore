import React, { useState, useEffect } from 'react'
import { Typography, Link } from '@material-ui/core';
import { ProjectData, ProjectStats, UserProfileInterface } from '../interfaces';
import moment from 'moment';
import { basePropType } from '../basePropType';
import { getProfilePath, getProjectDocPath, getProjectStatsDocPath } from '../data/paths';
import { handleFirebaseError } from '../util';
import { StandardProperties } from 'csstype';
import { isEqual } from 'lodash';
import { ROUTES } from '../data/routes';

export const AdditionalInformationComponent = (LocalComponent);

function LocalComponent(props: { publisherId: string, projectId: string } & basePropType) {
    const [userData, setUserData] = useState({} as UserProfileInterface);
    const [projectData, setProjectData] = useState({} as ProjectData);
    const [projectStats, setProjectStats] = useState({} as ProjectStats);

    const { projectId, publisherId } = props;

    useEffect(() => {
        const listener1 = props.firebase.firestore.doc(getProjectDocPath(publisherId, projectId))
            .onSnapshot((snap) => {
                const data = (snap.data() || {}) as any;
                if (!isEqual(projectData, data)) {
                    setProjectData(data);
                }
            }, (err) => handleFirebaseError(props, err, 'Failed to fetch project data'));


        const listener2 = props.firebase.firestore.doc(getProjectStatsDocPath(publisherId, projectId))
            .onSnapshot((snap) => {
                const data = (snap.data() || {}) as any;
                if (!isEqual(projectStats, data)) {
                    setProjectStats(data);
                }
            }, (err) => handleFirebaseError(props, err, 'Failed to fetch project stats'));

        const listener3 = props.firebase!.firestore.doc(getProfilePath(props.publisherId))
            .onSnapshot((snap) => {
                const data = (snap.data() || {}) as any;
                if (!isEqual(userData, data)) {
                    setUserData(data);
                }
            }, (err) => handleFirebaseError(props as any, err, 'Failed to fetch user profile'));

            return () => { listener1(); listener2(); listener3() };
    });

    const boxStyle: StandardProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexGrow: 1,
        flexBasis: 0,
        marginRight: '30px'
    }

    return (
        <div>
            <Typography component="h3" style={{ marginBottom: '30px' }}>
                Additional information
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={boxStyle}>
                    <Item heading="Publisher">
                        <Link onClick={() => props.history.push(`${ROUTES.PROJECTS_LIST_PAGE}/${props.urlUserId}`)} style={{ cursor: 'pointer' }}>{userData.name || props.publisherId}</Link>
                    </Item>
                    {projectData.createdAt && <Item heading="Release Date" content={moment(projectData.createdAt.toDate().toISOString(), moment.ISO_8601).toLocaleString()}></Item>}
                    {projectData.updatedAt && <Item heading="Last updated" content={moment(projectData.updatedAt.toDate().toISOString(), moment.ISO_8601).toLocaleString()}></Item>}
                </div>
                <div style={boxStyle}>
                    <Item heading="Category" content={projectData.category}></Item>
                    <Item heading="Description" content={projectData.description}></Item>
                </div>
                <div style={boxStyle}>
                    <Item heading="Total downloads" content={projectStats.numberOfDownloads! || 0}></Item>
                    <Item heading="Total releases" content={projectData.numberOfReleases! || 0}></Item>
                    <Item heading="Average rating" content={projectStats.averageRating! || 0}></Item>
                </div>
            </div>
        </div>
    )
}

const Item = (props: { heading: string, content?: string | number, children?: any }) => {
    const { heading, content, children } = props;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
            <Typography component="h6">{heading}</Typography>
            {content && <Typography variant="body1">{content}</Typography>}
            {children}
        </div>
    )
}
