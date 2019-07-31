import React, { useState } from 'react'
import { Typography } from '@material-ui/core';
import { ProjectData } from '../interfaces';
import moment from 'moment';
import { basePropType } from '../basePropType';
import { getProfilePath } from '../data/paths';
import { handleFirebaseError } from '../util';
import { withAllProviders } from '../providers/all-providers';

export const AdditionalInformationComponent = (LocalComponent);

function LocalComponent(props: { projectData: ProjectData, publisherId: string } & basePropType) {

    const [userData, setUserData] = useState({} as firebase.User);
    props.firebase!.firestore.doc(getProfilePath(props.publisherId)).get()
        .then((snap) => {
            // console.log(snap.data(), props.publisherId);
            const data = (snap.data() || {}) as any;
            if (userData.uid !== data.uid) {
                setUserData(data);
            }
        })
        .catch((err) => handleFirebaseError(props as any, err, 'Failed to fetch user profile'));

    if (!Object.keys(props.projectData).length) {
        return (<React.Fragment></React.Fragment>)
    }

    return (
        <div>
            <Typography component="h3" style={{ marginBottom: '30px' }}>
                Additional information
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {/* <Item heading="User ID" content={props.publisherId}></Item> */}
                    <Item heading="User" content={userData.displayName || props.publisherId}></Item>
                    <Item heading="Release Date" content={moment(props.projectData.createdAt.toDate().toISOString(), moment.ISO_8601).toLocaleString()}></Item>
                    <Item heading="Last updated" content={moment(props.projectData.updatedAt.toDate().toISOString(), moment.ISO_8601).toLocaleString()}></Item>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Item heading="User ID" content={props.publisherId}></Item>
                    <Item heading="Release Date" content={moment(props.projectData.createdAt.toDate().toISOString(), moment.ISO_8601).toLocaleString()}></Item>
                    <Item heading="Last updated" content={moment(props.projectData.updatedAt.toDate().toISOString(), moment.ISO_8601).toLocaleString()}></Item>
                </div>
            </div>
        </div>
    )
}

const Item = (props: { heading: string, content: string }) => {
    const { heading, content } = props;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
            <Typography component="h6">{heading}</Typography>
            <Typography variant="body1">{content}</Typography>
        </div>
    )
}
