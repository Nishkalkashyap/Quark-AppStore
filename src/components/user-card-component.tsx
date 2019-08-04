import React, { useState, useEffect } from 'react'
import { Card, Typography, CardContent, Button, CardActions, ButtonGroup, Chip } from '@material-ui/core';
import { ROUTES } from '../data/routes';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import { basePropType } from '../basePropType';
import { getDocument_userData } from '../data/paths';
import { handleFirebaseError, COLORS } from '../util';
import { isEqual } from 'lodash';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { UserProfileInterface } from '../interfaces';
import CardBgComponent from './main-background-component';


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
            <Card style={{ position: 'relative', margin: '40px 0px', padding: '40px 40px', background: 'transparent', color: COLORS.BACKGROUND, textAlign: 'center' }} elevation={4}>
                <CardBgComponent dotColor="transparent" bgColor="transparent" type="radial" />
                <Typography variant="h2" component="h1" color="inherit">
                    {userData.name || (props.firebase.auth.currentUser!.email!).split('@')[0]}
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <CardContent style={{ flexGrow: 2, flexBasis: 66, padding: '20px 0px 0px 0px' }}>
                        <Typography component="p" color="inherit">
                            {userData.bio || ''}
                        </Typography>
                        <Typography component="p" color="inherit" style={{ marginTop: '10px' }}>
                            {userData.location || ''}
                        </Typography>
                        {(userData.site || userData.githubUrl || userData.twitterUrl) &&
                            <div style={{ margin: '10px 0px' }}>
                                {userData.site && <Chip label="Website" variant="outlined" size="small" onClick={() => window.open(userData.site)} style={{ cursor: 'pointer', marginRight: '10px', color: 'inherit', borderColor: 'inherit' }} />}
                                {userData.githubUrl && <Chip label="GitHub" variant="outlined" size="small" onClick={() => window.open(userData.githubUrl)} style={{ cursor: 'pointer', marginRight: '10px', color: 'inherit', borderColor: 'inherit' }} />}
                                {userData.twitterUrl && <Chip label="Twitter" variant="outlined" size="small" onClick={() => window.open(userData.twitterUrl)} style={{ cursor: 'pointer', marginRight: '10px', color: 'inherit', borderColor: 'inherit' }} />}
                            </div>
                        }
                        <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <ButtonGroup style={{ flexGrow: 1, justifyContent: 'center' }} size="small" aria-label="small button group" color="inherit">
                                {(isOwner) &&
                                    <Button onClick={() => props.history.push(ROUTES.CREATE_NEW_PROJECT_PAGE)}>
                                        <NewReleasesIcon fontSize="small" style={{ marginRight: '10px' }} />
                                        Create new project
                                    </Button>
                                }
                                <Button onClick={() => props.history.push(ROUTES.EDIT_PROFILE_PAGE)}>
                                    <AccountBoxIcon fontSize="small" style={{ marginRight: '10px' }} />
                                    Edit Profile
                                </Button>
                            </ButtonGroup>
                        </CardActions>
                    </CardContent>
                </div>
            </Card>
        </React.Fragment>
    )
}
