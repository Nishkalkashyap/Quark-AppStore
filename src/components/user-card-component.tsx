import React, { useState, useEffect } from 'react'
import { Card, Typography, CardContent, Button, CardActions, Link, Chip } from '@material-ui/core';
import MainBgComponent, { MainBgContainerStyles } from './main-background-component';
import { ROUTES, POST_SLUG } from '../data/routes';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { basePropType } from '../basePropType';
import { getProfilePath } from '../data/paths';
import { handleFirebaseError } from '../util';
import { isEqual } from 'lodash';
import { UserProfileInterface } from '../interfaces';
import { StandardProperties } from 'csstype';


export default function UserCardComponent(props: basePropType & { userId: string }) {

    const { isOwner, userId } = props;

    const [userData, setUserData] = useState({} as UserProfileInterface);

    const chipStyle: StandardProperties = {
        color: 'inherit', borderColor: 'transparent', marginTop: '15px', marginRight: '15px'
    }
    const chipDownloadIcon: StandardProperties = {
        color: 'inherit'
    }

    useEffect(() => {
        console.log('here');
        const listener = props.firebase.firestore.doc(getProfilePath(userId))
            .onSnapshot((snap) => {
                const data = (snap.data() || {}) as any;
                if (!isEqual(userData, data)) {
                    setUserData(data);
                }
            }, (err) => handleFirebaseError(props, err, 'Failed to fetch user profile'));

        return listener;
    });

    return (
        <React.Fragment>
            <Card style={Object.assign({}, MainBgContainerStyles, { color: null, margin: '60px 0px', padding: '80px 40px' })} elevation={4}>
                <MainBgComponent bgColor='linear-gradient(90deg,#ffffffff,#488aff99 100%)' />
                <Typography variant="h2" component="h1" color="inherit">
                    {userData.name || userId}
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <CardContent style={{ flexGrow: 2, flexBasis: 66 }}>
                        <Typography component="p" color="inherit">
                            {userData.bio || ''}
                        </Typography>
                        {/* <Chip label={userData.location} variant="outlined" size="small" icon={<LocationOnIcon style={chipDownloadIcon} />} style={chipStyle} /> */}
                        <Typography component="p" color="inherit" style={{ marginTop: '10px' }}>
                            {userData.location || ''}
                        </Typography>
                        {userData.site && <Link onClick={() => window.open(userData.site)} style={{ cursor: 'pointer', marginTop: '10px', display : 'block' }}>{userData.site}</Link>}
                    </CardContent>
                </div>
                {(isOwner) && <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => props.history.push(ROUTES.CREATE_NEW_PROJECT_PAGE)}>
                        Create new project
                        <NewReleasesIcon fontSize="small" style={{ marginLeft: '10px' }} />
                    </Button>
                </CardActions>}
            </Card>
        </React.Fragment>
    )
}
