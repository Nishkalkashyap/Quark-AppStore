import React, { useEffect, useState } from 'react'
import { basePropType } from '../basePropType';
import { ProjectReviewInterface, UserProfileInterface } from '../interfaces';
import { Card, Typography, Divider } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import moment from 'moment';
import { getProfilePath } from '../data/paths';
import { handleFirebaseError } from '../util';

export default function ReviewItemComponent(props: basePropType & { review: ProjectReviewInterface }) {
    const { review } = props;

    const [userProfile, setUserProfile] = useState({} as UserProfileInterface);

    useEffect(() => {
        const listener = props.firebase.firestore.doc(getProfilePath(review.userId))
            .onSnapshot((snap) => {
                const data = (snap.data() || {}) as UserProfileInterface;
                if (data.name !== userProfile.name) {
                    setUserProfile(snap.data() || {})
                }
            }, (err) => handleFirebaseError(props, err, 'Failed to fetch user profile'));

        return listener;
    })

    return (
        <React.Fragment>
            <Card style={{ padding: '20px' }} key={review.userId + review.content}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                        {(userProfile || {}).name || review.userId}
                    </Typography>
                    <Typography variant="body2">
                        Created: {moment(review.createdAt.toDate().toISOString(), moment.ISO_8601).fromNow()}
                    </Typography>
                </div>
                <Divider style={{ margin: '10px 0px 10px 0px' }} />
                <Rating size="small" color="inherit" style={{ margin: '10px 0px' }} value={Number(review.rating) || 1} readOnly />
                <Typography variant="h5">
                    {review.title}
                </Typography>
                <Typography variant="body2">
                    {review.content}
                </Typography>
            </Card>
        </React.Fragment>
    )
}
