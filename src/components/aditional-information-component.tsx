import React, { useState } from 'react'
import { Typography } from '@material-ui/core';
import { ProjectData, ProjectStats } from '../interfaces';
import moment from 'moment';
import { basePropType } from '../basePropType';
import { getProfilePath } from '../data/paths';
import { handleFirebaseError } from '../util';
import { StandardProperties } from 'csstype';

export const AdditionalInformationComponent = (LocalComponent);

function LocalComponent(props: { projectData: ProjectData, projectStats: ProjectStats, publisherId: string } & basePropType) {

    const [userData, setUserData] = useState({} as firebase.User);
    props.firebase!.firestore.doc(getProfilePath(props.publisherId)).get()
        .then((snap) => {
            const data = (snap.data() || {}) as any;
            if (userData.uid !== data.uid) {
                setUserData(data);
            }
        })
        .catch((err) => handleFirebaseError(props as any, err, 'Failed to fetch user profile'));

    if (!Object.keys(props.projectData).length) {
        return (<React.Fragment></React.Fragment>)
    }

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
                    {/* <Item heading="User ID" content={props.publisherId}></Item> */}
                    <Item heading="Publisher" content={userData.displayName || props.publisherId}></Item>
                    <Item heading="Release Date" content={moment(props.projectData.createdAt.toDate().toISOString(), moment.ISO_8601).toLocaleString()}></Item>
                    <Item heading="Last updated" content={moment(props.projectData.updatedAt.toDate().toISOString(), moment.ISO_8601).toLocaleString()}></Item>
                </div>
                <div style={boxStyle}>
                    <Item heading="Category" content={props.projectData.category}></Item>
                    <Item heading="Description" content={props.projectData.description}></Item>
                </div>
                <div style={boxStyle}>
                    <Item heading="Total downloads" content={props.projectStats.numberOfDownloads}></Item>
                    <Item heading="Total releases" content={props.projectData.numberOfReleases}></Item>
                    <Item heading="Average rating" content={props.projectStats.averageRating}></Item>
                </div>
            </div>
        </div>
    )
}

const Item = (props: { heading: string, content: string | number }) => {
    const { heading, content } = props;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
            <Typography component="h6">{heading}</Typography>
            <Typography variant="body1">{content}</Typography>
        </div>
    )
}
