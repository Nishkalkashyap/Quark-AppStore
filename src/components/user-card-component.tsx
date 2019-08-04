import React, { useState, useEffect } from 'react'
import { Card, Typography, CardContent, Button, CardActions, Link, ButtonGroup } from '@material-ui/core';
import MainBgComponent, { MainBgContainerStyles } from './main-background-component';
import { ROUTES } from '../data/routes';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import { basePropType } from '../basePropType';
import { getDocument_userData } from '../data/paths';
import { handleFirebaseError } from '../util';
import { isEqual } from 'lodash';
import { UserProfileInterface } from '../interfaces';


export default function UserCardComponent(props: basePropType & { userId: string }) {

    const { isOwner, userId } = props;

    const [userData, setUserData] = useState({} as UserProfileInterface);

    useEffect(() => {
        const listener = props.firebase.firestore.doc(getDocument_userData(userId))
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
            {/* <Card style={Object.assign({}, MainBgContainerStyles, { margin: '60px 0px', padding: '80px 40px' })} elevation={4}> */}
            <Card style={{ margin: '60px 0px', padding: '80px 40px', background : 'transparent', boxShadow : 'none' }} elevation={4}>
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
                        {userData.site && <Link color="inherit" onClick={() => window.open(userData.site)} style={{ cursor: 'pointer', marginTop: '10px', display: 'block' }}>{userData.site}</Link>}
                        {userData.githubUrl && <Link color="inherit" onClick={() => window.open(userData.githubUrl)} style={{ cursor: 'pointer', marginTop: '10px', display: 'block' }}>GitHub</Link>}
                        {userData.twitterUrl && <Link color="inherit" onClick={() => window.open(userData.twitterUrl)} style={{ cursor: 'pointer', marginTop: '10px', display: 'block' }}>Twitter</Link>}
                    </CardContent>
                </div>
                {(isOwner) && <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ButtonGroup size="small" aria-label="small outlined button group" color="inherit">
                        <Button onClick={() => props.history.push(ROUTES.CREATE_NEW_PROJECT_PAGE)}>
                            Create new project
                        <NewReleasesIcon fontSize="small" style={{ marginLeft: '10px' }} />
                        </Button>
                    </ButtonGroup>
                </CardActions>}
            </Card>
        </React.Fragment>
    )
}
